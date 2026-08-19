import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { callAPI } from '../utils/utils';
import { useUser } from './useUser';

export const userCartStore = create(persist((set)=>({
  cartItems:[],
  addToCart:(item)=>{
    set((state)=>({cartItems:[...state.cartItems,item]}));
  },
  removeFromCart:(itemId)=>{
    console.log(itemId)
    set((state)=>({cartItems:state.cartItems.filter((cartItem)=>cartItem._id !== itemId)}));
  },
  clearCart:()=>{
    set(()=>({cartItems:[]}));
  },
  editQty:(item,qty)=>{
    set((state)=>({cartItems:state.cartItems.map((cartItem)=>cartItem._id === item._id ? {...cartItem,qty:qty} : cartItem)}));
  },
  fetchCartItems:async()=>{
    const access_token = useUser.getState().access_token;
    if(!access_token) return;
    const response = await callAPI('/cart','GET',null, 'json', null,{
      'x-auth-token':access_token
    });
    if(response.items?.length > 0){
      set(()=>({cartItems:response.items}));
    }
  },
}),{
  name:'cart-storage',
  storage:createJSONStorage(()=>localStorage),
  partialize:(state)=>({cartItems:state.cartItems}),
}))
