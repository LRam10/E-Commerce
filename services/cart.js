const mongoose = require('mongoose');
const Cart = require('../models/Cart');

/*
@Desc  Fetch a cart that belongs to this caller. The owner is part of the query rather
       than a check the caller makes afterwards, so it cannot be forgotten at a new
       call site.
@param {string} cartId
@param {object} owner - {userId} for a signed-in buyer, {guestId} for a guest
@returns {object} the cart
@throws {Error} .status 401 with no owner, 404 when the cart is missing or not theirs
*/
exports.getCart = async (cartId, {userId, guestId} = {}) => {
  if (!userId && !guestId) {
    throw Object.assign(new Error('Cart owner is required'), {status:401});
  }
  //A malformed id is a miss, not a server fault
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    throw Object.assign(new Error(`Cart ${cartId} not found`), {status:404});
  }

  const owner = userId ? {user_id: userId} : {guest_id: guestId};
  const cart = await Cart.findOne({_id: cartId, ...owner}).lean();
  //Same answer for "no such cart" and "not yours", so ids cannot be probed
  if (!cart) throw Object.assign(new Error(`Cart ${cartId} not found`), {status:404});
  return cart;
}

/*
@Desc  Retire a cart once it is paid for. Conditional on the cart still being active, so
       a webhook that arrives twice cannot drag a cart back out of a later state.
@returns {object|null} the cart, or null if it was already retired
*/
exports.markCartConverted = async (cartId) => {
  return Cart.findOneAndUpdate(
    {_id: cartId, status: 'active'},
    {$set: {status: 'converted'}},
    {new: true}
  );
}
