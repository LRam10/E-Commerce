const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'item' },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
})

const OrderSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:false
    },
    email:{type:String},
    address_street:{type:String},
    address_postal:{type:String},
    address_state:{type:String},
    address_city:{type:String},
    country:{type:String},
    items:[itemSchema],
    order_date:{
        type: Date,
        default: Date.now
    },
    shipped:{type:Boolean,default:false},
    close_date:{type:Date},
    payment_type:{type:String},
    //Stripe cents, matching session.amount_total exactly. Named for its unit because the
    //column previously held dollars and a silently mixed unit corrupts every revenue query.
    total_cents:{type:Number},
    status:{
        type:String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        required: true,
    },
    guest_id:{
        type:String,
        required:false
    },
    stripe_session_id:{
        type:String,
    }

});

//Partial so that orders created outside the Stripe flow, which have no session id, do
//not all collide on a single null value
OrderSchema.index(
    {stripe_session_id:1},
    {unique:true, partialFilterExpression:{stripe_session_id:{$type:'string'}}}
);

module.exports = mongoose.model('order',OrderSchema);
