import React, {useReducer} from 'react';
import {GET_ORDERS} from '../types';
import OrderContext from './orderContext';
import OrderReducer from './orderReducer';
import axios from 'axios';

const OrderState = (props) =>{
    const initialState = {
        orders:[],
    }
    const [state,dispatch] = useReducer(OrderReducer,initialState);

    const getOrders = async ()=>{
        try {
            const response = await axios.get('/orders');
            dispatch({type:GET_ORDERS,payload:response.data});
        } catch (error) {
            console.log(error)
        }
    }

    return <OrderContext.Provider
        value={{
            orders:state.orders,
            getOrders
        }}
    >
        {props.children}
    </OrderContext.Provider>
};
export default OrderState;