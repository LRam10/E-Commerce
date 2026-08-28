import React from 'react'
import Product from '../Cart/Product';
import { userCartStore } from '../../store/userCartStore';
const ItemList = ({ allowEdit, cartItems }) => {
  const { removeFromCart, increaseQty, decreaseQty } = userCartStore();
  return (
    <div className='min-h-0 flex-1 divide-y divide-sol-stroke-light overflow-y-auto'>
      {cartItems.map(product => (
        <div className='py-[15px] sm:py-[17px]' key={product._id}>
          <Product
            product={product}
            deleteItem={removeFromCart}
            increaseQty={increaseQty}
            decreaseQty={decreaseQty} 
            allowEdit={allowEdit}/>
        </div>
      ))}
    </div>
  )
}

export default ItemList