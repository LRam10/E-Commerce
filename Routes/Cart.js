const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const optionalAuth = require('../middleware/optionalAuth');

const User = require('../models/User');
const Cart = require('../models/Cart')
const { retreiveOwnerFromRequest } = require('../controllers/utils');
//Middlewares
const rateLimiter = require("../middleware/rateLimiter");
//Services
const { MAX_QTY, resolveCartItems, hydrateCartItems } = require('../services/items');

//A cart line is an item id and an amount. Anything else in the request is ignored, and
//the fields are picked out by hand below - validation rejects bad shapes but does not
//strip extra keys on its own.
const lineRules = (prefix) => [
    body(`${prefix}._id`).isMongoId().withMessage('Each cart line needs a valid item id'),
    body(`${prefix}.qty`).optional().isInt({ min: 1, max: MAX_QTY })
        .withMessage(`Quantity must be a whole number between 1 and ${MAX_QTY}`),
];

const pickLines = (items) => items.map(({ _id, qty }) => ({ _id, qty }));

//Unknown item, or not enough stock, answers with its own status. Anything else is ours.
const sendCartError = (res, error) => {
    if (error.status) {
        return res.status(error.status).json({ msg: error.message, unavailable: error.unavailable });
    }
    console.log(error);
    return res.status(500).json({ msg: 'Server error' });
}



const combineCartItems = (items) => {
    const quantitiesById = new Map();

    for (const item of items) {
        const id = String(item._id);
        const qty = Number(item.qty ?? 1);
        const nextQty = (quantitiesById.get(id) ?? 0) + qty;

        if (nextQty > MAX_QTY) {
            throw Object.assign(
                new Error(`Quantity must not exceed ${MAX_QTY}`),
                { status: 400 }
            );
        }

        quantitiesById.set(id, nextQty);
    }

    return [...quantitiesById.entries()].map(([_id, qty]) => ({ _id, qty }));
}

//@Type   POST
//@Desc   Create new cart
//@Access  Private
router.post("/", [
    optionalAuth,
    rateLimiter,
    body().isArray({ min: 1, max: 50 }).withMessage('A cart must be a non-empty list of items'),
    ...lineRules('*')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //status is part of the filter so a paid cart is never reopened - the buyer gets a
    //new one instead, which the partial unique index allows
    const filter = { ...retreiveOwnerFromRequest(req), status: 'active' };
    try {
        const reqItems = req.body;
        const groupedItems = combineCartItems(reqItems);
    
        const { lines, items } = await resolveCartItems(pickLines(groupedItems));
        //Upsert so a returning user's cart is replaced rather than rejected
        const cart = await Cart.findOneAndUpdate(
            filter,
            { $set: { items: lines } },
            { new: true, upsert: true }
        );
        return res.json({
            items,
            cartId: cart._id
        });
    } catch (error) {
        return sendCartError(res, error);
    }
});
//@Type   GET
//@Desc   Get Cart items
//@Access  Private
router.get("/", [optionalAuth, rateLimiter], async (req, res) => {
    try {
        const filter = { ...retreiveOwnerFromRequest(req), status: 'active' };
        const cart = await Cart.findOne(filter).select('items status _id');
        if (!cart) {
            return res.json({ items: [], active: false, cartId: null });
        }
        res.json({
            items: await hydrateCartItems(cart.items),
            active: cart.status === 'active',
            cartId: cart._id
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
//@Type   Put
//@Desc   Edit items in cart
//@Access  Private
router.put("/", [
    optionalAuth,
    rateLimiter,
    body('cartId').isMongoId().withMessage('A valid cartId is required'),
    body('items').isArray({ min: 1, max: 50 }).withMessage('items must be a non-empty list'),
    ...lineRules('items.*')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { cartId } = req.body;
  try {
    const groupedItems = combineCartItems(req.body.items);
    const { lines, items } = await resolveCartItems(pickLines(groupedItems));
    //Without the owner in the filter anyone holding a cartId could rewrite its items,
    //including while its owner is part way through paying for it
    const cart = await Cart.findOneAndUpdate(
      { _id: cartId, status: 'active', ...retreiveOwnerFromRequest(req) },
      { $set: { items: lines } },
      { new: true });
    if (!cart) {
      return res.status(404).json({ msg: 'Cart not found' });
    }
    res.json(items);
  } catch (error) {
    return sendCartError(res, error);
  }
});


module.exports = router;
