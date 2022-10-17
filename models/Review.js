const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user'
},
item_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'item',
    require:true
},
headline:{
    type:String,
    require:true
},
comments:{
    type:String,
    require:true
},
rating:{
    type:Number,
    require:true,
},
recommend_option:{
    type:String,
    require:true
},
date_created:{
    type:String,
    require:true
}
});

module.exports = mongoose.model('review',ReviewSchema);