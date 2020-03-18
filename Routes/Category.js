const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const fileupload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

router.use(fileupload({
    useTempFiles:true
}));
//check for missing attributes
const { check, validationResult } = require('express-validator');
cloudinary.config({ 
    cloud_name: process.env.Cloud_Name, 
    api_key: process.env.API_KEY_Cloud, 
    api_secret: process.env. API_Secret_Cloud
  });

//@Type   Get
//@Desc   Get all categories
//@Access  Public
router.get('/', async (req,res)=>{
try {
    let categories = await Category.find({});
    res.status(200).json(categories);
} catch (error) {
    console.log(error);
    res.status(500);
}
});
//@Type   Post 
//@Desc   Create a new category
//@Access  Private
router.post('/',[auth,
    [check('category_name','Please provide category name').not().isEmpty(),
    check('img_url','Please provide an image').not().isEmpty()]],
    async (req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty){
            return res.status(400).json({errors:error.array()});
        }
        //Getting request body and files can be an array
        const {category_name,sub_categories} = req.body;
        const img_url = req.files.img_url;
        console.log(req.body);
        try {
            let category = await Category.findOne({category_name});
            if (category){
                return res.status(400).json({msg:'Category already created.'});
            }
            //upload picture to cloudinary
            cloudinary.uploader.upload(img_url.tempFilePath,{folder:'/Category'}, async function(error, result){
                if(!error){
                    try {
                        category = new Category({category_name,sub_categories,img_url:result.url});
                        console.log(category);
                        await category.save();
                        return res.json(category);
                    } catch (error) {
                        console.log(error);
                        return res.status(400).json({msg:'Error Ulpoading Img'})
                    }
                } 
                });
        } catch (error) {
            console.log(error);
            res.status(400);
        }
});

//@Type   Delete
//@Desc   DElETE items from
//@Access  Private
router.delete("/:id",auth,async (req,res)=>{

    try {
        let category = await Category.findOne({_id:new mongoose.Types.ObjectId(req.params.id)});
        // the category is no longer available
        if (!category)return res.status(400).json({msg:'category does not exists'})
        if(req.user.access != 1){
            return res.status(400).json({msg:'Not Authorized'})
        }
         await Category.findOneAndRemove({_id:new mongoose.Types.ObjectId(req.params.id)});
         res.json({msg:'category has been Remove'});
    } catch (error) {
        res.status(500).json({msg:'Server Error'});
    }
   });

module.exports = router;