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
const categories = require('./Routes/Category');
const reviews = require('./Routes/Reviews');
const cookieParse = require('cookie-parser')
//Database
const connectDB = require('./config/db');

connectDB();
const PORT = process.env.PORT || 5000;
//Local and prod (prod client is served from the same Railway domain)
const allowedOrigins = [
  'http://localhost:5173',
  'https://web-production-43196.up.railway.app'
];
const corsOptions = {
  origin: (origin, callback) => {
    //No Origin header = same-origin or non-browser client, let it through
    if (!origin) return callback(null, true);
    return callback(null, allowedOrigins.includes(origin));
  },
  credentials: true
};
app.set('trust proxy', 1) 
app.disable('x-powered-by');
//body-parser middleware
app.use(express.json({extended:false}));

app.use(cookieParse())
app.use(cors(corsOptions));
//all routes
app.use('/register',user);
app.use('/items',items);
app.use('/cart',cart);
app.use('/auth',auth);
app.use('/categories',categories);
app.use('/checkout',checkout);
app.use('/orders',orders);
app.use('/reviews',reviews);
if(process.env.NODE_ENV === 'production'){
    //set static folder
    app.use(express.static('client/build'));
    app.get('*',(req,res)=>res.sendFile(path.resolve(__dirname,'client','build','index.html')));
}

if(require.main === module){
    app.listen(PORT,()=> console.log(`Connected to port ${PORT}`));
}else{  
    module.exports = app;
}