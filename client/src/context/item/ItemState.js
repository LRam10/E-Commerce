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
        item:{}
    };
    const [state,dispatch] = useReducer(ItemReducer,initialState);

    //Add Item
    const addItem = item =>{
        item.id = Math.random()*100;
        item.price = parseFloat(item.price);
        item.qty = parseInt(item.qty);
        console.log(item);
        dispatch({type:ADD_ITEM,payload:item});
    }

    //Delet Item
    
    //Update Item

    //Set Current Item

    //Clear Current Item

    //Filter Items

    //Clear Filter

    return <ItemContext.Provider
    value = {
        {
        items:state.items,
        item:state.item,
        addItem,
        }
    }>
    {props.children}
    </ItemContext.Provider>
};
export default ItemState;