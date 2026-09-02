const express = require("express");
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');

const User = require('../models/User');
const Cart = require ('../models/Cart')

//Middlewares
const rateLimiter = require("../middleware/rateLimiter");
//@Type   POST
//@Desc   Create new cart
//@Access  Private
router.post("/",[optionalAuth, rateLimiter], async (req,res)=>{
    const items = req.body;
    let userId = req?.user?.id;
    const isGuest = req?.guestId;
    if(isGuest){
        userId = req?.guestId;
    }
    const filter = isGuest ? {guest_id:userId} : {user_id:userId};
    try {
        //Upsert so a returning user's cart is replaced rather than rejected
        const cart = await Cart.findOneAndUpdate(
            filter,
            {$set:{items, active:true}},
            {new:true, upsert:true}
        );
        return res.json({
            items: cart.items,
            cartId: cart._id
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Server error'})
    }
});
//@Type   GET
//@Desc   Get Cart items
//@Access  Private
router.get("/",[optionalAuth, rateLimiter],async (req,res)=>{
    try {
        let userId = req?.user?.id;
        const isGuest = req?.guestId;
        if (isGuest) {
            userId = req?.guestId;
        }
        const filter = isGuest ? { guest_id: userId } : { user_id: userId };
        let cart = await Cart.findOne(filter).select('items active _id');
        if(!cart){
            cart = {items:[],active:false}
        }
        res.json({
            items:cart.items,
            active:cart.active,
            cartId:cart._id
        });
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
//@Type   Put
//@Desc   Edit items in cart
//@Access  Private
router.put("/",[optionalAuth,rateLimiter], async (req,res)=>{
    const cartId = req.body.cartId;
    if(!cartId){
        return res.status(400).json({msg:'Missing cartId'});
    }
    const items = req.body.items;
    try {
        const cart = await Cart.findOneAndUpdate({_id:cartId},
            {$set:{items:items}},
            {new:true});
            res.json(cart.items);
    } catch (error) {
        res.status(500).json({msg:'Server Error'});
    }
});


module.exports = router;