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
        case ADD_ITEM:return {...state,};
        case DELETE_ITEM:return{
            ...state,
            items:state.items.filter(item=>item.id !== action.payload)
        };
        case UPDATE_ITEM: return{
            ...state,items:state.items.map(item => item.id === action.payload.id?
                action.payload:item)
        };
        case SET_CURRENT: return{
            ...state,
            currentItem:action.payload
        };
        case CLEAR_CURRENT: return{
            ...state,
            currentItem:null
        };
        default:return state;
    }
}