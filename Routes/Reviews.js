const express = require("express");
const router = express.Router();
const Review = require('../models/Review');

//@Type   Post
//@Desc   Post a review to a item
//@Access  Public
router.post('/', async (req,res)=>{
    console.log(req.body);
    try{
        const review = new Review(req.body);
        review.save();
        res.status(200).json({msg:"Review succesfully submitted"});
    }
    catch(error){
    console.log(req.body);
    return res.status(400).json({msg:'Error Adding Your Review'});
    }
})
router.get('/:id', async (req,res)=>{
    let id = req.params.id
try {
    const reviews = await Review.find({item_id:id}).lean();
    res.send(reviews);
} catch (error) {
    console.log(error);
    res.status(500);
}
})


module.exports = router;