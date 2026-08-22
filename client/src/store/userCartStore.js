import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { callAPI } from '../utils/utils';

//Cart lines reuse the item schema, so `qty` on a cart item is the ordered amount,
//not the stock count it holds on the catalogue item
export const MAX_QTY = 10;
const clampQty = (qty) => {
  const amount = Math.round(Number(qty));
  if (!Number.isFinite(amount) || amount < 1) return 1;
  return Math.min(amount, MAX_QTY);
};
//Lines persisted before quantities existed can carry a missing or stock qty
const normalizeItems = (items) => (items ?? []).map((item) => ({ ...item, qty: clampQty(item.qty) }));

export const userCartStore = create(persist((set,get)=>({
  cartItems:[],
  //Adding an item already in the cart tops up its quantity instead of duplicating the line
  addToCart:(item, qty = 1)=>{
    const amount = clampQty(qty);
    set((state)=>{
      const isInCart = state.cartItems.some((cartItem)=>cartItem._id === item._id);
      if(isInCart){
        return {cartItems:state.cartItems.map((cartItem)=>cartItem._id === item._id
          ? {...cartItem, qty:clampQty(clampQty(cartItem.qty) + amount)}
          : cartItem)};
      }
      return {cartItems:[...state.cartItems,{...item, qty:amount}]};
    });
  },
  removeFromCart:(itemId)=>{
    set((state)=>({cartItems:state.cartItems.filter((cartItem)=>cartItem._id !== itemId)}));
  },
  clearCart:()=>{
    set(()=>({cartItems:[]}));
  },
  //Absolute set, clamped to 1..MAX_QTY. Removing a line is removeFromCart's job
  setQty:(itemId, qty)=>{
    set((state)=>({cartItems:state.cartItems.map((cartItem)=>cartItem._id === itemId
      ? {...cartItem, qty:clampQty(qty)}
      : cartItem)}));
  },
  increaseQty:(itemId)=>{
    const item = get().cartItems.find((cartItem)=>cartItem._id === itemId);
    if(!item) return;
    get().setQty(itemId, clampQty(item.qty) + 1);
  },
  decreaseQty:(itemId)=>{
    const item = get().cartItems.find((cartItem)=>cartItem._id === itemId);
    if(!item) return;
    get().setQty(itemId, clampQty(item.qty) - 1);
  },
  //Push the current cart to the server, must run while the auth cookie is still valid
  saveCart:async()=>{
    await callAPI('/cart','POST',null,'json',get().cartItems);
  },
  //Callers gate on isAuthenticated, the cookie carries the auth
  fetchCartItems:async()=>{
    const response = await callAPI('/cart','GET');
    if(response.items?.length > 0){
      set(()=>({cartItems:normalizeItems(response.items)}));
    }
  },
}),{
  name:'cart-storage',
  storage:createJSONStorage(()=>localStorage),
  partialize:(state)=>({cartItems:state.cartItems}),
  //Older carts were stored without quantities, repair them on load
  merge:(persisted, current)=>({...current, ...persisted, cartItems:normalizeItems(persisted?.cartItems)}),
}))

//Total units in the cart, not the number of distinct lines
export const selectCartCount = (state)=>state.cartItems.reduce((total,item)=>total + clampQty(item.qty), 0);
export const selectCartSubtotal = (state)=>state.cartItems.reduce((total,item)=>total + Number(item.price) * clampQty(item.qty), 0);
