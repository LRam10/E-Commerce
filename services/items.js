const Item = require('../models/Item');
const MAX_QTY = 10;

exports.clampQty =  (qty) => Math.min(Math.max(Math.round(Number(qty)) || 1, 1), MAX_QTY);
exports.buildLineItems = async (items) => {
  try {   
    const catalogue = await Item.find({_id:{$in:items.map((item)=>item._id)}}).lean();
    const byId = new Map(catalogue.map((item)=>[String(item._id), item]));
    //Note: Perhaps we should lock and decrement the items here. The reason is theres 1 item left
    //Two users click the checkout.session and both pay,(payment exectution is done by stripe we only get a webhook )
    return  items.map(({_id, qty})=>{
      const item = byId.get(String(_id));
      if(!item) throw Object.assign(new Error(`Unknown item ${_id}`), {status:400});
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
  } catch (error) {
    console.log(error);
    return null;
  }
}

exports.createHashItems = (items)=>{
  const hash = {
    currency:'usd',
    items:items.map(({_id, qty, sku})=>(`${_id}:${qty}:${sku}`)).join('|').sort((a,b)=>a.localeCompare(b))
  }
  return crypto.createHash('sha256').update(JSON.stringify(hash)).digest('hex');
}