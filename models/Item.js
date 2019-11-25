const mongoose = require('mongoose');

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
    }
});

module.exports = mongoose.model('item',ItemSchema);