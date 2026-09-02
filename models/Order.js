const mongoose = require('mongoose');


const itemSchema = new mongoose.Schema({
    item_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'item' },
    quantity: { type: Number, default: 1 }
})

const OrderSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:false
    },
    email:{type:String},
    address_street:{type:String},
    address_postal:{type:Number},
    address_state:{type:String},
    address_city:{type:String},
    country:{type:String},
    items:[itemSchema],
    order_date:{
        type: Date,
        default: Date.now()
    },
    shipped:{type:Boolean,default:false},
    close_date:{type:Date},
    payment_type:{type:String},
    total:{type:Number},
    stripe_session_id:{
        type:String,
        unique:true
    },
    status:{
        type:String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        required: true,
    }
});

module.exports = mongoose.model('order',OrderSchema);