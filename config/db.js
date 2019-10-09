const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
//get URI from the config file
const db = process.env.MongoURI;

const connectDB = async ()=>{
    try {
        await mongoose.connect(db,{
            useNewUrlParser:true,
            useCreateIndex:true,
            useFindAndModify:false
        });
        console.log("MongoDB has been connected") 
    } catch (error) {
        console.error(error.msg);
        process.exit(1);
    }
    
}
module.exports = connectDB;