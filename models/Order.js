const mongoose = require('mongoose');
const Item = require('./Item');

const OrderSchema = new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    email:{type:String},
    address_street:{type:String},
    address_postal:{type:Number},
    address_state:{type:String},
    address_city:{type:String},
    country:{type:String},
    items:[Item.schema],
    order_date:{
        type: Date,
        default: Date.now()
    },
    shipped:{type:Boolean,default:false},
    close_date:{type:Date},
    payment_type:{type:String},
    total:{type:Number}
});

module.exports = mongoose.model('order',OrderSchema);