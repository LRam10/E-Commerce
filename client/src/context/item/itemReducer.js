import  {
    ADD_ITEM,
    DELETE_ITEM,
    UPDATE_ITEM,
    FILTER_ITEMS,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_FILTER,
    GET_ITEMS
    } from '../types';
export default (state,action)=>{
    switch(action.type){
        case ADD_ITEM:return {...state,}
        default:return state;
    }
}