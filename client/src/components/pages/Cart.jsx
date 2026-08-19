import React from 'react';
import Product from '../Cart/Product';
import Statement from '../Cart/Statement';
import {useExpiration} from '../../utils/useExpiration';
import { useQueryClient } from '@tanstack/react-query';
import { userCartStore } from '../../store/userCartStore';
const Cart = () => {
//Checks current time with expiration time and updates the cart to database for Logged in user
const {cartItems,removeFromCart,editQty} = userCartStore();

if(!cartItems.length > 0) return(<div className='jumbotron'><h1>You Cart is Currently Empty</h1></div>);
else {
    return (
        <div className='w-[300px]'>
            <div className='row mt-3 mb-3'>
                <div className='col-lg-8'>
                 <span className='mt-2 mb-2'>Total Items ({cartItems.length})</span>   
                {cartItems.map(product=>(
                    <div className='border m-1 d-flex' key={product._id}>
                        <Product product={product} deleteItem={removeFromCart} editQty={editQty}/>
                    </div>
                ))}
                </div>
                <div className='col-lg-4'>
                    {/* <Statement/> */}
                </div>
            </div>
        </div>
    )
}
}
export default Cart
