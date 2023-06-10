const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonToken = require('jsonwebtoken');

const userModel = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
//@Type   POST
//@Desc   Send data to register user
//@Access  Public
router.post("/",[
    check('firstName','Please add an first name').not().isEmpty(),
    check('lastName','Please add an last name').not().isEmpty(),
    check('email','Please include valid email').isEmail(),   
    check('currentPassword','Password must be atleast 6 characters long').not().isEmpty(),   
],async (req,res)=>{
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    //destructuring from the request body
    const {firstName,lastName,currentPassword,email} = req.body;
    try {
        let user = await userModel.findOne({email});
        //checks if user already exists
        if(user){
            return res.status(400).json({msg:'User already exists'});
        }
        user = new userModel({
            firstName,lastName,passwordObject:{password:currentPassword},email
        })
        //generates encryption method and encrypts password
        const salt = await bcrypt.genSalt(10);
        user.passwordObject.password = await bcrypt.hash(currentPassword,salt);
        await user.save();
        const payload = {
            user:{id:user.id}
        }
        jsonToken.sign(payload,process.env.jwtSecret,{
            expiresIn:3600,

        },(err,token)=>{
            if (err) throw err;
            res.json({token});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({msg:'Server error'});
    }
})

module.exports = router;