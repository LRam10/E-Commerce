const express = require('express');
const route = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
////@Type   GET
//@Desc   GET Users
//@Access  Private 
route.get('/',auth,async (req,res)=>{
    try {
        const offset = req.query?.page ?? 0;
        const limit = Number(req.query?.limit) < 10 ? 10 : Number(req.query?.limit);
        const userId = req.user.id;
        const orders = await Order.find({user_id:userId},{'__v':0,'user_id':0}).
        limit(limit).skip(offset * limit).sort({order_date: -1});
        const total = await Order.countDocuments({user_id:userId});
        res.json({
            orders,
            total,
            page: Math.floor(offset / limit) + 1,
            limit: limit
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error", error: error.message});
    }
});
module.exports = route;