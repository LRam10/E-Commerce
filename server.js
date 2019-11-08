const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
//Routes
const user = require('./Routes/User');
const items =require('./Routes/Items');
const cart =require('./Routes/Cart');
const auth =require('./Routes/Auth');
//Database
const connectDB = require('./config/db');

connectDB();
const PORT = process.env.PORT || 5000;
//body-parser middleware
app.use(express.json({extended:false}));

app.get('/',(req,res)=>{
res.send("Okay");
});
app.use(cors());
app.use('/register',user);
app.use('/items',items);
app.use('/cart',cart);
app.use('/auth',auth);

app.listen(PORT,()=> console.log(`Connected to port ${PORT}`));