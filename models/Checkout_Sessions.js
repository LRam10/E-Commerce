const mongoose = require('mongoose');

const CheckoutSessionSchema = new mongoose.Schema({
  cart_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Cart',
    required:true
  },
  stripe_session_id:{
    type:String,
  },
  status:{
    type:String,
    enum:['pending','completed','expired'],
    default:'pending',
    required:true
  },
  expires_at:{
    type:Number,
    required:true
  },
  idempotency_key:{
    type:String,
    required:true
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
  },
  //A Date, not a unix number: MongoDB TTL indexes silently ignore any other type,
  //which would look correct in review while sweeping nothing
  completed_at:{
    type: Date
  }
},)

//One checkout session per cart. This index is what actually prevents a double-click
//from becoming two payable Stripe sessions - the service code only decides who wins.
CheckoutSessionSchema.index({cart_id:1},{unique:true});
CheckoutSessionSchema.index({stripe_session_id:1});
//The claim outlives the payment on purpose. Stripe retries a failing webhook for up to
//3 days, and the claim is the only thing tying a Stripe session back to a cart, so it is
//kept well past that window and then swept.
const CLAIM_RETENTION_SECONDS = 7 * 24 * 60 * 60;
CheckoutSessionSchema.index({completed_at:1},{expireAfterSeconds:CLAIM_RETENTION_SECONDS});

module.exports = mongoose.model('checkout_session',CheckoutSessionSchema);
