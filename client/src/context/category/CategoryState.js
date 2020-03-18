import React ,{useReducer} from 'react';
import {GET_CATEGORIES} from '../types';
import CategoryReducer from './CategoryReducer';
import CategoryContext from './categoryContext';
import axios from 'axios';


const CategoryState = props => {
    const initialState ={
        categories:[],
        currentCategory:null
    };

    const [state,dispatch] = useReducer(CategoryReducer,initialState);
    //get categories
    const getCategories = async ()=>{
        try {
            const response = await axios.get('/categories');
            dispatch({type:GET_CATEGORIES,payload:response.data});
        } catch (error) {
            console.log(error);

        }
    };


    return <CategoryContext.Provider
    value = {{
        categories:state.categories,
        currentCategory:state.currentCategory,
        getCategories
    }}>
        {props.children}
    </CategoryContext.Provider>
};

export default CategoryState;