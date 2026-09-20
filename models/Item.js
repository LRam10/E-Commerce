const mongoose = require('mongoose');

//One entry per live claim that holds stock on this item. The decrement of qty and the
//push of this marker happen in the same write, so a request that dies between "reserve"
//and "record on the claim" still leaves proof of what it took. The claim_id in the filter
//is what stops a replayed request reserving the same line twice.
const ReservationSchema = new mongoose.Schema({
    claim_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'checkout_session',
        required:true
    },
    qty:{
        type:Number,
        required:true,
        min:1
    }
},{_id:false});

const ItemSchema = mongoose.Schema({
    sku:{
        type:String,
    },
    name:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    in_stock:{
        type:Boolean,
        default:true
    },
    img_url:{
        type:String,
    },
    qty:{
        type:Number,
        required:true
    },
    //select:false keeps the array off every catalogue read
    reservations:{
        type:[ReservationSchema],
        default:[],
        select:false
    }
});

ItemSchema.index({'reservations.claim_id':1});

module.exports = mongoose.model('item',ItemSchema);
