const mongoose = require('mongoose');

//A cart line is a reference and an amount, nothing else. Name, price and stock are read
//from the catalogue whenever they are needed, so a price posted by a client can never
//reach the database and cannot end up on an order.
const CartLineSchema = new mongoose.Schema({
    item_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'item',
        required:true
    },
    qty:{
        type:Number,
        required:true,
        min:1
    }
},{_id:false});

const CartSchema = mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    guest_id:{
        type:String,
        required:false
    },
    items:[CartLineSchema],
    //Single source of truth for where the cart is in its life. A cart leaves 'active'
    //once it is paid for, and checkout refuses any cart that is not active - that is
    //what stops the back button producing a second payment for the same basket.
    status:{
        type:String,
        enum:['active','converted','abandoned'],
        default:'active'
    },
    cartSessionId:{
        type:String,
        required:false
    }
});

//One ACTIVE cart per owner. Scoped to status so a converted cart does not block the
//owner's next one, and typed so guest carts - which have no user_id - are not all
//indexed under the same null and rejected as duplicates of each other.
CartSchema.index(
    {user_id:1},
    {unique:true, partialFilterExpression:{user_id:{$type:'objectId'}, status:'active'}}
);
CartSchema.index(
    {guest_id:1},
    {unique:true, partialFilterExpression:{guest_id:{$type:'string'}, status:'active'}}
);

module.exports = mongoose.model('cart',CartSchema);
