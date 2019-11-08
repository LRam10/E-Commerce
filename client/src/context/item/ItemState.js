import React,{useReducer} from 'react';
import ItemContext from './itemContext';
import ItemReducer from './itemReducer';
import  {
ADD_ITEM,
DELETE_ITEM,
UPDATE_ITEM,
FILTER_ITEMS,
SET_CURRENT,
CLEAR_CURRENT,
CLEAR_FILTER
} from '../types';

const ItemState = props =>{
    const initialState = {
        items:[{
            id:1,
            sku:'WB0001',
            description:'Red Strings,simple or with ornament',
            category:'Red_Strings',
            price:4.99,
            img_url:'http://res.cloudinary.com/doei459zd/image/upload/v1570636906/fevbvzsl4zeqeywzthks.png',
            qty:4
              },{
            id:2,
            sku:'WB0002',
            description:'Wooden,simple or with ornament',
            category:'Red_Strings',
            price:4.99,
            img_url:'http://res.cloudinary.com/doei459zd/image/upload/v1570636906/fevbvzsl4zeqeywzthks.png',
            qty:6
            },
            {
            id:3,
            sku:'RS0001',
            description:'Red Strings,simple or with ornament',
            category:'Wooden',
            price:4.99,
            img_url:'http://res.cloudinary.com/doei459zd/image/upload/v1570636906/fevbvzsl4zeqeywzthks.png',
            qty:4
            },
            {
                id:4,
                sku:'RS0003',
                description:'Paracord Red and blue',
                category:'Paracord',
                price:4.99,
                img_url:'http://res.cloudinary.com/doei459zd/image/upload/v1570636906/fevbvzsl4zeqeywzthks.png',
                qty:4
                }
            ],
        currentItem:null,
    };
    const [state,dispatch] = useReducer(ItemReducer,initialState);

    //Add Item
    const addItem = item =>{
        item.id = Math.random()*100;
        item.price = parseFloat(item.price);
        item.qty = parseInt(item.qty);
        dispatch({type:ADD_ITEM,payload:item});
    }
    //Delete Item
    const deleteItem = id =>{
        dispatch({type:DELETE_ITEM,payload:id});
    }
    
    //Update Item
    const updateItem = (item) =>{
        dispatch({type:UPDATE_ITEM,payload:item});
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

    return <ItemContext.Provider
    value = {
        {
        items:state.items,
        currentItem:state.currentItem,
        addItem,
        deleteItem,
        setCurrentItem,
        clearCurrentItem,
        updateItem
        }
    }>
    {props.children}
    </ItemContext.Provider>
};
export default ItemState;