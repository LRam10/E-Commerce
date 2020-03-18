const mongoose = require('mongoose');
const CategorySchema = mongoose.Schema({
    category_name :{
        type:String,
        require:true
    },
    sub_categories:{
        type:[String],
        default: []
    },
    img_url:{
        type:String,
        required:true
    }
});
module.exports = mongoose.model('categories',CategorySchema);