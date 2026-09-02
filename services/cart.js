const Cart = require('../models/Cart');

exports.getCart = async (cartId) => {
  try {
    const cart = await Cart.findById(cartId).lean();
    if(!cart) throw Object.assign(new Error(`Cart ${cartId} not found`), {status:404});
    return cart;
  }catch (error) {
    console.log(error);
    throw Object.assign(new Error('Failed to get cart items'), {status:500});
  }
}