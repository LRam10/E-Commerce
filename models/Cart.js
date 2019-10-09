const mongoose = require('mongoose');
const Item = require('./Item');

const CartSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    items:[Item.schema,{
        _id:false
    }],
    active:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('cart',CartSchema);