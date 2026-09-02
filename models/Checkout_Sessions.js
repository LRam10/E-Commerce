const mongoose = require('mongoose');

const CheckoutSessionSchema = new mongoose.Schema({
  cart_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Cart',
    primaryKey:true,
    required:true
  },
  stripe_session_id:{
    type:String,
  },
  status:{
    enum:['pending','completed','expired'],
  },
  expires_at:{
    type:Number,
  },
  idempotency_key:{
    type:String,
  },
  fingerprint:{
    type:String,
    required:true
  },
  client_secret:{
    type:String,
  },
  created_at:{
    type: Number,
  }
},)

module.exports = mongoose.model('checkout_session',CheckoutSessionSchema);