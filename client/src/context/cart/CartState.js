import React,{ useReducer, } from 'react';
import CartContext from './cartContext';
import CartReducer from './CartReducer';
import axios from 'axios';
import {
GET_CART,
REMOVE_ITEM,
ADD_ITEM_INCART,
EDIT_ITEM_INCART,
POST_CART,
CART_ERROR,
CHECKOUT_CART,
CLEAR_ERRORS,
CHECKOUT_AUTH,
EDIT_DB_CART_LOGOUT,
UPDATE_CART,
} from '../types'

const CartState = props =>{
    const initialState = {
        products:JSON.parse(localStorage.getItem('cart')) || [],
        inDB:JSON.parse(localStorage.getItem('inDB')) || false,
        success:null,
        error:null
    }
    const[state,dispatch] = useReducer(CartReducer,initialState);

    //Get Cart from DB
    const getCart = async ()=>{
        try {
            const response = await axios.get('/cart');
            dispatch({type:GET_CART,payload:response.data});
        } catch (error) {
            console.log(error);
        }
    }
    //Add Item
    const addToCart = (item)=>{
        dispatch({type:ADD_ITEM_INCART,payload:item});
    }
    //Edit Cart
    const editCartQty = (item)=>{
        item.qty = parseInt(item.qty);
        dispatch({type:EDIT_ITEM_INCART,payload:item});
    }

    //Remove Item
    const deleteFromCart = (id)=> dispatch({type:REMOVE_ITEM,payload:id});
    //Edit IteminCart

    //Post Cart in DB
    const createCart = async (items)=>{
        const config = {
            headers:{'Conent-Type':'Application/json'}
        };
        try {
             await axios.post('/cart',items,config);
            dispatch({type:POST_CART});
        } catch (error) {
            console.log(error.response.data.msg);
        }
    };
    //Edit Cart in DB when user is logging out
    const editCart = async (items)=>{
        let config = {
            headers:{'Content-Type':'Application/json'}
        };
        try {
            await axios.put('/cart',items,config);
            dispatch({type:EDIT_DB_CART_LOGOUT});

        } catch (error) {
            console.log(error)
        }
    };
    //Update cart in DB when expiration time has reached and return current items
    const updateDbCart = async (items)=>{
        let config = {
            headers:{'Content-Type':'Application/json'}
        };
        try {
            const response = await axios.put('/cart',items,config);
            dispatch({type:UPDATE_CART,payload:response.data});
        } catch (error) {
            console.log(error);
        }
    }
    //checkout for guest
    const checkOut = async (paymentMethod,price,items)=>{
        try {
            const response = await axios.post('/checkout',{paymentMethod, price,items});
            dispatch({type:CHECKOUT_CART,payload:response.data.status});
        } catch (error) {
            dispatch({type:CART_ERROR,payload:error.response.data.error});
        }
    };
    //checkout for logged in user
    const authCheckout = async (paymentMethod,price,items)=>{
        try {
            const response = await axios.post('/checkout/auth',{paymentMethod, price,items});
            dispatch({type:CHECKOUT_AUTH,payload:response.data.status});
        } catch (error) {
            dispatch({type:CART_ERROR,payload:error.response.data.error});
        }
    }

    const clearErrors = ()=> dispatch({type:CLEAR_ERRORS});
    return <CartContext.Provider 
    value={{
        products:state.products,
        inDB:state.inDB,
        error:state.error,
        success:state.success,
        addToCart,
        deleteFromCart,
        editCartQty,
        createCart,
        getCart,
        checkOut,
        clearErrors,
        authCheckout,
        editCart,
        updateDbCart
    }}>
        {props.children}
    </CartContext.Provider>
};

export default CartState;