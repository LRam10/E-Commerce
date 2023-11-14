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
            await mongoose.connect(db,{
                useNewUrlParser:true,
                useUnifiedTopology:true
            })
            console.log('Local Mongoo DB Connected')
        }
    } catch (error) {
        console.error(error+" heres the error");
        process.exit(1);
    }
    
}
module.exports = connectDB;