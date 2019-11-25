const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth');

const User = require('../models/User');
const Cart = require ('../models/Cart')
//@Type   POST
//@Desc   Create new cart
//@Access  Private
router.post("/",auth, async (req,res)=>{
    const items = req.body;
    try {
        let cart = await Cart.findOne({user_id:req.user.id});
        if(cart != null){
            return res.status(500).json({msg:'Cart is already active'})
        }
         cart = new Cart({
            user_id:req.user.id,items,active:true
        });
        await cart.save();
         return res.sendStatus(200);
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
        let cart = await Cart.findOne({user_id:req.user.id}).select('items active -_id');
        if(!cart){
            cart = {items:[],active:false}
        }
        res.json(cart);
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
});
//@Type   Put
//@Desc   Edit items in cart
//@Access  Private
router.put("/",auth, async (req,res)=>{
    try {
        const cart = await Cart.findOneAndUpdate({user_id:req.user.id},
            {$set:{items:req.body}},
            {new:true});
            res.json(cart.items);
    } catch (error) {
        res.status(500),json({msg:'Server Error'});
    }
});


module.exports = router;