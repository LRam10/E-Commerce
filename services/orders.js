const Order = require('../models/Order');

exports.createOrderDb = async(stripeSessionId, items, status, total)=>{
  console.log({
    items
  })
  try {
    return await Order.findOneAndUpdate(
      {stripe_session_id: stripeSessionId}, 
      {
        $setOnInsert: { items,total },$set: { status: status }
      }, 
      { upsert: true,returnDocument:"after" })
  } catch (error) {
    console.log('Failed to create order');
    return null
  }
}