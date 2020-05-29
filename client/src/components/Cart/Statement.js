import React,{Fragment,useContext,useState} from 'react';
import Form from './Form';

import CartContext from '../../context/cart/cartContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

let stripePromise;

if(process.env.NODE_ENV !== 'production'){
    stripePromise = loadStripe(process.env.REACT_APP_STRIPE_CLIENT);
}
else{
    stripePromise = loadStripe('pk_live_anGjuc0oJPgRAK0ViINHQVwS00pcxYvZuO');
}

const Statement = () => {
    //CartContext
    const cartContext =useContext(CartContext);
    const { products} = cartContext;
    let total = 0;
    products.forEach(product => {
        total += product.qty * product.price;
    });
    let tax = total.toFixed() * 0.08250;
    let grandTotal = total + tax;

    const[form,setForm] = useState(false);
    const toggleForm = ()=>setForm(!form);
    return (
        <Fragment>
            <div className='w-100 border mt-4 mb-4'>
            <h3 className='py-3 pl-2'><b>Order Summary</b></h3>
            <div className='clearfix px-3'>
                <p className='float-left'>Sub-Total</p>
                <p className='float-right'><b>${total.toFixed(2)}</b></p>
            </div>
            <div className='clearfix px-3'>
                <p className='float-left'>Delivery</p>
                <p className='float-right'><b>--</b></p>
            </div>
            <div className='clearfix px-3'>
                <p className='float-left'>Sale Tax</p>
                <p className='float-right'><b>${tax.toFixed(2)}</b></p>
            </div>
            <div className='clearfix px-3'>
                <p className='float-left'>Total</p>
                <p className='float-right'><b>${grandTotal.toFixed(2)}</b></p>
            </div>
            </div>
            <Elements stripe={stripePromise} >
                <button className='btn btn-dark' onClick={toggleForm}>Checkout</button>
                {form === true &&(
                <Form grandTotal={grandTotal} products={products} toggleForm={toggleForm}/>)}
            </Elements>
        </Fragment>
    )
}
export default Statement
