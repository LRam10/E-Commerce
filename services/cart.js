const mongoose = require('mongoose');
const Cart = require('../models/Cart');

const DUPLICATE_KEY = 11000;

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

/*
@Desc  Hand a converted cart back to its owner after a delayed payment failed. Conditional
       on the cart still being converted, so this can never resurrect a basket that has
       moved on to some other state.
@returns {object|null} the cart, or null if it could not be reopened
*/
exports.reopenCart = async (cartId) => {
  try {
    return await Cart.findOneAndUpdate(
      { _id: cartId, status: 'converted' },
      { $set: { status: 'active' } },
      { new: true }
    );
  } catch (error) {
    //Only one active cart per owner. If the buyer already started a new one while the
    //payment was clearing, leaving this cart converted is the right outcome - they have
    //moved on, and their current basket is the live one.
    if (error?.code !== DUPLICATE_KEY) throw error;
    return null;
  }
}
