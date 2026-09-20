const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
////@Type   GET
//@Desc   GET Users
//@Access  Private 
route.get('/',auth,async (req,res)=>{
    try {
        const page = Number(req.query?.page ?? 1);
        const limit = Number(req.query?.limit ?? 5);
        const userId = req.user.id;
        const orders = await Order.find({user_id:userId},{'__v':0,'user_id':0})
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort({order_date: -1});
        const total = await Order.countDocuments({user_id:userId});
        res.json({
            orders,
            total,
            page,
            limit: limit
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error", error: error.message});
    }
});
module.exports = route;