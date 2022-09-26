const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
//get URI from the config file
const db = process.env.MongoURI;

const connectDB = async ()=>{
    try {
        if(process.env.NODE_ENV === 'production'){
            await mongoose.connect(db,{
                useNewUrlParser:true,
                useCreateIndex:true,
                useFindAndModify:false,
                useUnifiedTopology:true
            });
            console.log("MongoDB has been connected");
        }
        else{
            await mongoose.connect('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.5.4',{
                useNewUrlParser:true,
                useCreateIndex:true,
                useFindAndModify:false,
                useUnifiedTopology:true
            })
            console.log('Locla Mongood Db')
        }
    } catch (error) {
        console.error(error.msg+" heres the error");
        process.exit(1);
    }
    
}
module.exports = connectDB;