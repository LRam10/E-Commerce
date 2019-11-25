import React,{useReducer} from 'react';
import ItemContext from './itemContext';
import ItemReducer from './itemReducer';
import axios from 'axios';
import  {
ADD_ITEM,
DELETE_ITEM,
UPDATE_ITEM,
FILTER_ITEMS,
SET_CURRENT,
CLEAR_CURRENT,
CLEAR_FILTER,
ITEM_ERROR,
CLEAR_ERRORS,
GET_ITEMS,
CLEAR_ITEMS,
} from '../types';

const ItemState = props =>{
    const initialState = {
        items:[],
        currentItem:null,
        error:null,
        success:null
    };
    const [state,dispatch] = useReducer(ItemReducer,initialState);
    //Get items
    const getItems = async (category)=>{
        category = category.charAt(0).toUpperCase() + category.slice(1)
        try {
            const response = await axios.get(`/items/${category}`);
            dispatch({type:GET_ITEMS,payload:response.data});
        } catch (error) {
            console.log(error.response);
        }
    };

    //Add Item
    const addItem = async item =>{
        item.price = parseFloat(item.price);
        item.qty = parseInt(item.qty);
        try {
            let response =await axios.post(`/items`,item);
            dispatch({type:ADD_ITEM,payload:response.data.msg});
        } catch (error) {
            dispatch({ITEM_ERROR,payload:error.response.data.msg});
        }
    }
    //Delete Item
    const deleteItem = async id =>{
        try {
             await axios.delete(`/items/${id}`);
            dispatch({type:DELETE_ITEM,payload:id});
        } catch (error) {
            dispatch({type:ITEM_ERROR,payload:error.response.data.msg});
        }
    }
    
    //Update Item
    const updateItem = async (item) =>{
        const config ={
            headers:{
                'Content-Type':'Application/json'
            }
        };
        try {
            const response = await axios.put(`/items/${item._id}`,item,config);
            console.log(response.data);
            dispatch({type:UPDATE_ITEM,payload:response.data});
        } catch (error) {
            dispatch({type:ITEM_ERROR,payload:error.response.data.msg});
        }

    }
    //Set Current Item
    const setCurrentItem = item =>{
        dispatch({type:SET_CURRENT,payload:item});
    }
    //Clear Current Item
    const clearCurrentItem = () =>{
        dispatch({type:CLEAR_CURRENT});
    }
    //Filter Items

    //Clear Filter

    //Clear Errors
    const clearErrors = ()=> dispatch({type:CLEAR_ERRORS});
    return <ItemContext.Provider
    value = {
        {
        items:state.items,
        currentItem:state.currentItem,
        error:state.error,
        success:state.success,
        addItem,
        deleteItem,
        setCurrentItem,
        clearCurrentItem,
        updateItem,
        clearErrors,
        getItems
        }
    }>
    {props.children}
    </ItemContext.Provider>
};
export default ItemState;