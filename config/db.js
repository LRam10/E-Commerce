const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
//get URI from the config file
const db = encodeURI(process.env.MongoURI);

const connectDB = async ()=>{
    try {
        if(process.env.NODE_ENV !== 'production'){
            await mongoose.connect(db,{
              useUnifiedTopology:true
            });
        }
        else{
            await mongoose.connect(db)
            console.log('Local Mongoo DB Connected')
        }
    } catch (error) {
        console.error(error+" heres the error");
        process.exit(1);
    }
    
}
module.exports = connectDB;