import  {
    ADD_ITEM,
    DELETE_ITEM,
    UPDATE_ITEM,
    FILTER_ITEMS,
    SET_CURRENT,
    CLEAR_CURRENT,
    CLEAR_FILTER,
    GET_ITEMS,
    ITEM_ERROR,
    CLEAR_ERRORS,
    } from '../types';
export default (state,action)=>{
    switch(action.type){
        case GET_ITEMS:return{
            ...state,
            items:action.payload
        }
        case ADD_ITEM:return {...state,success:action.payload};
        case DELETE_ITEM:return{
            ...state,
            items:state.items.filter(item=>item._id !== action.payload)
        };
        case UPDATE_ITEM: return{
            ...state,
            items:state.items.map(item => item._id === action.payload._id ?
                action.payload : item)
        };
        case SET_CURRENT: return{
            ...state,
            currentItem:action.payload
        };
        case CLEAR_CURRENT: return{
            ...state,
            currentItem:null
        };
        case ITEM_ERROR:return{
            ...state,
            error:action.payload
        }
        case CLEAR_ERRORS:return{
            ...state,
            success:null
        }
        default:return state;
    }
}