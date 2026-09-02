const crypto = require('node:crypto');
const Item = require('../models/Item');
const MAX_QTY = 10;
exports.MAX_QTY = MAX_QTY;

const clampQty = (qty) => Math.min(Math.max(Math.round(Number(qty)) || 1, 1), MAX_QTY);
exports.clampQty = clampQty;

exports.buildLineItems = async (items) => {
  const catalogue = await Item.find({_id:{$in:items.map((item)=>item.item_id)}}).lean();
  const byId = new Map(catalogue.map((item)=>[String(item._id), item]));
  //Note: Perhaps we should lock and decrement the items here. The reason is theres 1 item left
  //Two users click the checkout.session and both pay,(payment exectution is done by stripe we only get a webhook )
  return  items.map(({item_id, qty})=>{
    const item = byId.get(String(item_id));
    if(!item) throw Object.assign(new Error(`Unknown item ${item_id}`), {status:400});
    if(item.in_stock === false) throw Object.assign(new Error(`${item.name} is out of stock`), {status:409});

    return {
      quantity:clampQty(qty),
      price_data:{
        currency:'usd',
        //automatic_tax cannot price a line without knowing how tax relates to it
        tax_behavior:'exclusive',
        unit_amount:Math.round(item.price * 100),
        product_data:{
          name:item.name,
          description:item.description,
          images:item.img_url ? [item.img_url] : undefined,
          metadata:{_id:String(item._id), sku:item.sku ?? ''}
        }
      }
    };
  });
}
exports.createHashItems = (lineItems)=>{
  const lines = lineItems
    .map(({quantity, price_data})=>[
      price_data.product_data.metadata._id,
      quantity,
      price_data.unit_amount,
      price_data.currency
    ].join(':'))
    .sort((a,b)=>a.localeCompare(b));
  return crypto.createHash('sha256').update(lines.join('|')).digest('hex');
}

/*
@Desc  Resolve the lines a client posted against the catalogue. Only the item id and the
       quantity are taken from the request; name, price and stock always come from the
       catalogue. Every short line is collected before throwing, so the buyer is told
       about all of them at once instead of one per attempt.
@param {array} items - client lines, each with _id and qty
@returns {object} {lines, items} - lines to store, hydrated items to return to the client
@throws {Error} .status 400 for an unknown item, 409 when stock cannot cover the request
*/
exports.resolveCartItems = async (items) => {
  const catalogue = await Item.find({_id:{$in:items.map((item)=>item._id)}}).lean();
  const byId = new Map(catalogue.map((item)=>[String(item._id), item]));

  const lines = [];
  const hydrated = [];
  const unavailable = [];

  for (const {_id, qty} of items) {
    const item = byId.get(String(_id));
    if (!item) throw Object.assign(new Error(`Unknown item ${_id}`), {status:400});

    const amount = clampQty(qty);
    const available = item.in_stock === false ? 0 : (item.qty ?? 0);
    if (available < amount) {
      unavailable.push({_id:String(item._id), name:item.name, requested:amount, available});
      continue;
    }
    lines.push({item_id:item._id, qty:amount});
    //The catalogue item's own qty is its stock count, so the ordered amount replaces it
    hydrated.push({...item, qty:amount});
  }

  if (unavailable.length) {
    throw Object.assign(
      new Error('Some items are no longer available in the quantity requested'),
      {status:409, unavailable}
    );
  }
  return {lines, items:hydrated};
}

/*
@Desc  Join stored cart lines back onto the catalogue so the client gets names and prices
       it never sent. An item since removed from the catalogue drops out of the view
       rather than rendering as an empty row.
@param {array} lines - stored cart lines, each with item_id and qty
@returns {array} hydrated items
*/
exports.hydrateCartItems = async (lines) => {
  if (!lines?.length) return [];
  const catalogue = await Item.find({_id:{$in:lines.map((line)=>line.item_id)}}).lean();
  const byId = new Map(catalogue.map((item)=>[String(item._id), item]));
  return lines
    .map(({item_id, qty})=>{
      const item = byId.get(String(item_id));
      return item ? {...item, qty} : null;
    })
    .filter(Boolean);
}
