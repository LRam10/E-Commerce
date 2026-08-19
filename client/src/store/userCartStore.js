import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { callAPI } from '../utils/utils';

export const userCartStore = create(persist((set,get)=>({
  cartItems:[],
  addToCart:(item)=>{
    set((state)=>({cartItems:[...state.cartItems,item]}));
  },
  removeFromCart:(itemId)=>{
    set((state)=>({cartItems:state.cartItems.filter((cartItem)=>cartItem._id !== itemId)}));
  },
  clearCart:()=>{
    set(()=>({cartItems:[]}));
  },
  editQty:(item,qty)=>{
    set((state)=>({cartItems:state.cartItems.map((cartItem)=>cartItem._id === item._id ? {...cartItem,qty:qty} : cartItem)}));
  },
  //Push the current cart to the server, must run while the auth cookie is still valid
  saveCart:async()=>{
    await callAPI('/cart','POST',null,'json',get().cartItems);
  },
  //Callers gate on isAuthenticated, the cookie carries the auth
  fetchCartItems:async()=>{
    const response = await callAPI('/cart','GET');
    if(response.items?.length > 0){
      set(()=>({cartItems:response.items}));
    }
  },
}),{
  name:'cart-storage',
  storage:createJSONStorage(()=>localStorage),
  partialize:(state)=>({cartItems:state.cartItems}),
}))
