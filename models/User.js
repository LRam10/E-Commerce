const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true,
    },
    lastName:{
        type:String,
        require:true,
    },
    passwordObject:{
        password:{
            type:String,
        },
        numberOfTries:{
            type:Number,
            default: 6
        }
    },
    picture:{
        type:String,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    emailVerify:{
        type:Boolean,
        default:false
    },
    accessType:{
        type:Number,
        default:0,
    }
});

module.exports = mongoose.model('user',UserSchema);