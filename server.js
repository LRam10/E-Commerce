const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path')
dotenv.config();
//Routes
const user = require('./Routes/User');
const items =require('./Routes/Items');
const cart =require('./Routes/Cart');
const auth =require('./Routes/Auth');
const checkout = require('./Routes/Checkout')
const orders = require('./Routes/Order');
//Database
const connectDB = require('./config/db');

connectDB();
const PORT = process.env.PORT || 5000;
//body-parser middleware
app.use(express.json({extended:false}));

// app.get('/',(req,res)=>{
// res.send("Okay");
// });
app.use(cors());
app.use('/register',user);
app.use('/items',items);
app.use('/cart',cart);
app.use('/auth',auth);
app.use('/checkout',checkout);
app.use('/orders',orders);
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'client','build','index.html')));
}

app.listen(PORT,()=> console.log(`Connected to port ${PORT}`));