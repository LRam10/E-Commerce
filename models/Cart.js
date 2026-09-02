const mongoose = require('mongoose');
const Item = require('./Item');

const CartSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    guest_id:{
        type:String,
        required:false
    },
    items:[Item.schema,{
        _id:false
    }],
    active:{
        type:Boolean,
        default:false
    },
    cartSessionId:{
        type:String,
        required:false
    }
});

module.exports = mongoose.model('cart',CartSchema);