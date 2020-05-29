const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.Stripe_Secret);
const uuid = require('uuid/v4');
const auth = require('../middleware/auth');
const Cart = require ('../models/Cart')
const mongoose = require('mongoose');
const Order = require('../models/Order');
// For guest User
router.post('/', async (req,res)=>{
let status;
let error;
try {
    let { paymentMethod,price,items } = req.body;
    price = parseFloat(price);
    console.log(paymentMethod);
    const payment = await stripe.paymentIntents.create({
        amount:price,
        currency:'usd',
        payment_method:paymentMethod.id,
        receipt_email:paymentMethod.email,
        description:'Thanks for your business',
        shipping:{
            name:paymentMethod.billing_details.name,
            address:{
                line1:paymentMethod.billing_details.address.line1,
                line2:paymentMethod.billing_details.address.line2,
                city:paymentMethod.billing_details.address.city,
                country:paymentMethod.billing_details.address.country,
                postal_code:paymentMethod.billing_details.address.postal_code
            }
        },
        confirm:true
    });
    console.log(payment);
    //Create History
    orderHistory = new Order({
        email:paymentMethod.email,
        address_street:paymentMethod.billing_details.address.line1,
        address_postal:paymentMethod.billing_details.address.zip,
        address_state:paymentMethod.billing_details.address.state,
        address_city:paymentMethod.billing_details.address.city,
        country:paymentMethod.billing_details.address.country,
        items,
        payment_type:paymentMethod.card.brand,
        total:price
    });
    status= 'Successful Transaction'
    await orderHistory.save();
    res.json({status});

} catch (err) {
    error = 'failure';
    console.log(err);
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
        let { paymentMethod,price,items } = req.body;
        price = parseFloat(price);

        const customers = await stripe.customers.list({email:paymentMethod.email});
        if(customers.data.length === 0){
             customer = await stripe.customers.create({
                email:paymentMethod.email,
                source:paymentMethod.id,
                id:req.user.id
            });
        }
        customer = customers.data[0];
        await stripe.charges.create({
            amount:price * 100,
            currency:'usd',
            customer:customer.id,
            receipt_email:paymentMethod.email,
            description:'Thanks for your business',
            shipping:{
                name:paymentMethod.billing_details.name,
                address:{
                    line1:paymentMethod.billing_details.address.line1,
                    city:paymentMethod.billing_details.address.city,
                    country:paymentMethod.billing_details.address.country,
                    postal_code:paymentMethod.billing_details.address.zip
                }
            }
        },);
        //Create Order History
        orderHistory = new Order({
            user_id:req.user.id,
            email:paymentMethod.email,
            address_street:paymentMethod.billing_details.address.line1,
            address_postal:paymentMethod.billing_details.address.zip,
            address_state:paymentMethod.billing_details.address.state,
            address_city:paymentMethod.billing_details.address.city,
            country:paymentMethod.billing_details.address.country,
            items,
            payment_type:paymentMethod.card.brand,
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