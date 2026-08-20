import React from 'react';
import Product from '../Cart/Product';
import { userCartStore } from '../../store/userCartStore';

const Cart = () => {
//Checks current time with expiration time and updates the cart to database for Logged in user
const {cartItems,removeFromCart,editQty} = userCartStore();

const subtotal = cartItems.reduce((sum, p) => sum + Number(p.price) * Number(p.qty || 1), 0);

if(!cartItems.length > 0) return(
    <div className='flex h-full flex-col items-center justify-center gap-[10px] px-[17px] text-center'>
        <h2 className='text-[21px] leading-[28px] tracking-[-1px] text-black'>Your cart is currently empty</h2>
        <p className='text-[15px] leading-[21px] text-sol-gray'>Add a bracelet to get started.</p>
    </div>
);
else {
    return (
        <div className='flex h-full flex-col'>
            <h2 className='shrink-0 px-[17px] pb-[15px] pt-[17px] text-[18px] leading-[28px] tracking-[-1px] text-black sm:text-[21px]'>
                Total items ({cartItems.length})
            </h2>

            <div className='min-h-0 flex-1 divide-y divide-sol-stroke-light overflow-y-auto'>
                {cartItems.map(product=>(
                    <div className='py-[15px] sm:py-[17px]' key={product._id}>
                        <Product product={product} deleteItem={removeFromCart} editQty={editQty}/>
                    </div>
                ))}
            </div>

            <div className='mt-auto flex shrink-0 flex-col gap-[15px] border-t border-sol-stroke-light px-[17px] py-[17px]'>
                <div className='flex items-center justify-between'>
                    <span className='text-[15px] leading-[21px] text-sol-gray'>Subtotal</span>
                    <span className='font-display text-[16px] font-medium tracking-[0.18px] text-black'>
                        &#36;{subtotal.toFixed(2)}
                    </span>
                </div>
                <button className='h-[56px] w-full rounded-pill border border-sol-stroke bg-sol-red text-[15px] font-medium text-white transition-colors hover:bg-sol-red-dark focus-visible:outline-sol-ink sm:h-[60px]'>
                    Checkout
                </button>
            </div>
        </div>
    )
}
}
export default Cart
