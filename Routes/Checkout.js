const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.Stripe_Secret);
const uuid = require('uuid/v4');
const auth = require('../middleware/auth');
const Cart = require ('../models/Cart')
const mongoose = require('mongoose');
const Order = require('../models/Order');

router.post('/', async (req,res)=>{
let status;
let error;
try {
    let guest_id = uuid();
    let { token,price,items } = req.body;
    price = parseFloat(price);
    const customer = await stripe.customers.create({
        email:token.email,
        source:token.id
    });
    const idempotency_key = uuid();
    await stripe.charges.create({
        amount:price * 100,
        currency:'usd',
        customer:customer.id,
        receipt_email:token.email,
        description:'Thanks for your business',
        shipping:{
            name:token.card.name,
            address:{
                line1:token.card.address_line1,
                line2:token.card.address_line2,
                city:token.card.address_city,
                country:token.card.address_country,
                postal_code:token.card.address_zip
            }
        }
    },{idempotency_key});
    //Create History
    orderHistory = new Order({
        user_id:new mongoose.Types.ObjectId(guest_id),
        email:token.email,
        address_street:token.card.address_line1,
        address_postal:token.card.address_zip,
        address_state:token.card.address_state,
        address_city:token.card.address_city,
        country:token.card.address_country,
        items,
        payment_type:token.card.brand,
        total:price
    });
    status= 'Successful Transaction'
    res.json({status});

} catch (err) {
    error = 'failure';
    res.status(500).json({error});
}
});
//For Authenticated user creates a new user if user email is not
//already available. 
router.post('/auth',auth, async (req,res)=>{
    let status;
    let error;
    try {
        let customer;
        let orderHistory;
        let { token,price,items } = req.body;
        price = parseFloat(price);

        const customers = await stripe.customers.list({email:token.email});
        if(customers.data.length === 0){
             customer = await stripe.customers.create({
                email:token.email,
                source:token.id,
                id:req.user.id
            });
        }
        customer = customers.data[0];
        const idempotency_key = uuid();
        await stripe.charges.create({
            amount:price * 100,
            currency:'usd',
            customer:customer.id,
            receipt_email:token.email,
            description:'Thanks for your business',
            shipping:{
                name:token.card.name,
                address:{
                    line1:token.card.address_line1,
                    line2:token.card.address_line2,
                    city:token.card.address_city,
                    country:token.card.address_country,
                    postal_code:token.card.address_zip
                }
            }
        },{idempotency_key});
        //Create Order History
        orderHistory = new Order({
            user_id:req.user.id,
            email:token.email,
            address_street:token.card.address_line1,
            address_postal:token.card.address_zip,
            address_state:token.card.address_state,
            address_city:token.card.address_city,
            country:token.card.address_country,
            items,
            payment_type:token.card.brand,
            total:price
        });
        await orderHistory.save();
        //Update Recent cart items
        await Cart.findOneAndUpdate({user_id:new mongoose.Types.ObjectId(req.user.id)},
            {$set:{items:[]}});
        status= 'Successful Transaction'
        res.json({status});
    
    } catch (err) {
        error = 'failure';
        res.status(500).json({error});
    }
    });
module.exports = router;