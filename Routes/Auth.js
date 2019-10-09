const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonToken = require('jsonwebtoken');
const userModel = require('../models/User');
const auth = require('../middleware/auth');
const dotenv = require('dotenv');
dotenv.config();
//@Type   POST
//@Desc   Create Authentication
//@Access  Private
router.get("/",auth,async (req,res)=>{
    try {
        //mongoose returns a promise
        const user = await userModel.findById(req.user.id).select('-passwordObject');
        res.json(user)
    } catch (err) {
        console.log(err.message);
        res.status(500).send("server error");
    }
});
//@Type   GEt
//@Desc   get authentication token
//@Access  Public
router.post("/",
[check('email','Please provide a valid email').isEmail(),
check('password','Please input a password').not().isEmpty()]
,async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try {
    //destructuring from the request body
    const {password,email} = req.body;
    let user = await userModel.findOne({email});
    //if user is not available
    if(!user) return res.json({msg:"Email doesn't exists"});
    const isMatch = await bcrypt.compare(password,user.passwordObject.password);
    if(!isMatch) {
        user.passwordObject.numberOfTries--;
        await user.save()
        return res.status(400).json({msg:"Invalid password"});
    }
    const payload = {
        user:{id:user.id,access:user.accessType}
    }
    jsonToken.sign(payload,process.env.jwtSecret,{
        expiresIn:3600,

    },(err,token)=>{
        if (err) throw err;
        res.json({token});
    });
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Server Error');
    }
    

});
module.exports = router;