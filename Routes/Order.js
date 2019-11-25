const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
////@Type   GET
//@Desc   GET Users
//@Access  Private
route.get('/',auth,async (req,res)=>{
    try {
        const orders = await Order.find({user_id:req.user.id},{'__v':0,'user_id':0});
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.json.status(500).json({msg:"Server Error"});
    }
});

module.exports = route;