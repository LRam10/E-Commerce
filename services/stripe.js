const stripe = require('stripe')(process.env.TEST_STRIPE_SECRET_KEY);
const Item = require('../models/Item');
//Mirrors MAX_QTY in the client cart store. The client clamps for the UI, this
//clamps because the request body is not something we control
const MAX_QTY = 10;

const clampQty = (qty) => Math.min(Math.max(Math.round(Number(qty)) || 1, 1), MAX_QTY);
const buildLineItems = async (items) => {
  const catalogue = await Item.find({_id:{$in:items.map((item)=>item.item_id)}}).lean();
  const byId = new Map(catalogue.map((item)=>[String(item._id), item]));

  return items.map(({item_id, quantity})=>{
    const item = byId.get(String(item_id));
    if(!item) throw Object.assign(new Error(`Unknown item ${item_id}`), {status:400});
    if(item.in_stock === false) throw Object.assign(new Error(`${item.name} is out of stock`), {status:409});

    return {
      quantity:clampQty(quantity),
      price_data:{
        currency:'usd',
        //automatic_tax cannot price a line without knowing how tax relates to it
        tax_behavior:'exclusive',
        unit_amount:Math.round(item.price * 100),
        product_data:{
          name:item.name,
          description:item.description,
          images:item.img_url ? [item.img_url] : undefined,
          metadata:{item_id:String(item._id), sku:item.sku ?? ''}
        }
      }
    };
  });
}
/*
@Docs
//@Desc   Create a new stripe session for a user with an indempotency 
// key to prevent duplicate sessions
//@param {string}   sessionId - Object containing session details
//@param {array} items - Array of items to be purchased, each with item_id and quantity
//@returns {object} - Returns an object containing the client secret and checkout session ID
*/
exports.createCheckoutSession = async (items, checkoutSessionId)=>{
  try {

    const line_items = await buildLineItems(items);
  
     return await stripe.checkout.sessions.create({
       ui_mode:"elements",
       line_items,
       mode:'payment',
       //ui_mode elements rejects success_url. Redirect-based methods come back here
       //and the page reads the outcome from get-session-status
       return_url:`${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
       metadata:{
         checkoutSessionId
       },
       automatic_tax:{
         enabled:true
       }
     //Replaying the same cart returns the session already created for it rather
     //than opening another one
     },{idempotencyKey:`checkout:${checkoutSessionId}`})

  }catch(error){
    console.log(error)
    return null
  }


}