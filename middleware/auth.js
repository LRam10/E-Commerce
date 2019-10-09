const jsonToken = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = function (req,res,next){
//get token from header
const token = req.header('x-auth-token');

//check if it exists
if(!token) return res.status(401).json({msg:"Unauthorized"})

try {
    const decoded = jsonToken.verify(token,process.env.jwtSecret);
    req.user = decoded.user;
    next();
} catch (error) {
    res.status(401).json({msg:"Token not valid"});
}
}