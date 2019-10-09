const express = require("express");
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');
const cloudinary = require('cloudinary').v2;
const fileupload = require('express-fileupload');
const mongoose = require('mongoose');

router.use(fileupload({
    useTempFiles:true
}));
const { check, validationResult } = require('express-validator');
cloudinary.config({ 
    cloud_name: process.env.Cloud_Name, 
    api_key: process.env.API_KEY_Cloud, 
    api_secret: process.env. API_Secret_Cloud
  });

//@Type   POST
//@Desc   Publish a new item from admin page
//@Access  Public
router.post("/",[auth,[
    check('sku').not().isEmpty(),
    check('description','Please provide a description.').not().isEmpty(),
    check('category','Please provide a category.').not().isEmpty(),
    check('price','Please provide a price').not().isEmpty(),
    check('qty').not().isEmpty()
]],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    let {sku,description,category,price,qty} = req.body;
    const img_url = req.files.img_url;
    try {
        let item = await Item.findOne({sku})
          if(item){
             return res.json({msg:'Item has laready been created'});
          }
        //Upload the picture and saves item in the database  
        cloudinary.uploader.upload(img_url.tempFilePath, async function(error, result){
            if(!error){
                try {
                    item = new Item({sku,category,description,price,img_url:result.url,qty});
                    await item.save();
                    res.status(200);
                } catch (error) {
                    console.log(error);
                }
            } 
            });    
    } catch (error) {
        console.log(error);
    }
});
//@Type   GET
//@Desc   GET items of categories
//@Access  Public
router.get("/:category",async (req,res)=>{
    try {
    let items = await Item.find({category:req.params.category});
    res.json(items);
    } catch (error) {
        console.log(error);
        res.status(500);
    }
});

//@Type   Put
//@Desc   Edit items from admin page
//@Access  Private
router.put("/:id",auth,async (req,res)=>{
    const {sku,description,category,price,qty} = req.body;
    //build contact object
    const itemFields={}
    if(sku) itemFields.sku = sku;
    if(description) itemFields.description = description;
    if(category) itemFields.category = category;
    if(price) itemFields.price = price;
    if(qty) itemFields.qty = qty;
    console.log(typeof req.user.id);
    try {
        let item = await Item.findOne({_id:new mongoose.Types.ObjectId(req.params.id)});
        // the item is no longer available
        if (!item)return res.status(400).json({msg:'Item does not exists'})
        if(req.user.access != 1){
            return res.status(400).json({msg:'Not Authorized'})
        }
         item = await Item.findOneAndUpdate({_id:new mongoose.Types.ObjectId(req.params.id)},
            {$set:itemFields});
            res.json(item);
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Server Error'});
    }
});

//@Type   Delete
//@Desc   DElETE items from
//@Access  Private
router.delete("/:id",auth,async (req,res)=>{

    try {
        let item = await Item.findOne({_id:new mongoose.Types.ObjectId(req.params.id)});
        // the item is no longer available
        if (!item)return res.status(400).json({msg:'Item does not exists'})
        if(req.user.access != 1){
            return res.status(400).json({msg:'Not Authorized'})
        }
         await Item.findOneAndRemove({_id:new mongoose.Types.ObjectId(req.params.id)});
         res.json({msg:'Contact Remove'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:'Server Error'});
    }
   });

module.exports = router;