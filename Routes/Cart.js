const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const User = require('../models/User');
const Cart = require ('../models/Cart')
//@Type   POST
//@Desc   Create new cart
//@Access  Private
router.post("/",auth, async (req,res)=>{
    const {items} = req.body;
    try {
        let cart = await Cart.findOne({user_id:req.user.id});
        if(cart.active){
            return res.status(500).json({msg:'Cart is already active'})
        }
         cart = new Cart({
            user_id:req.user.id,items,active:true
        });
        const newCart = await cart.save();
        res.json(newCart);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Server error'})
    }
});
//@Type   GET
//@Desc   Get Cart items
//@Access  Private
router.get("/",auth,async (req,res)=>{
    try {
        const cart = await Cart.find({id:req.body.id});
        res.json(cart)
    } catch (error) {
        console.log(error);
    }
});
//@Type   Put
//@Desc   Edit items in cart
//@Access  Private
router.put("/",(req,res)=>{
 res.send("edit cart item");
});


module.exports = router;