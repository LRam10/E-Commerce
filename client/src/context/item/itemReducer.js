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
    GET_LOADING,
    GETITEMBYNAME,
    } from '../types';
export default (state,action)=>{
    switch(action.type){
        case GET_ITEMS:return{
            ...state,
            items:action.payload,
            loading:false,
        }
        case GETITEMBYNAME:return{
            ...state,
            currentItem:action.payload,
            loading:false,
        }
        case ADD_ITEM:return {
            ...state,
            success:action.payload,
            loading:false
        };
        case DELETE_ITEM:return{
            ...state,
            items:state.items.filter(item=>item._id !== action.payload),
            loading:false,
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
        case GET_LOADING:return{
            ...state,
            loading:true
        }
        case FILTER_ITEMS:
            return{
                ...state,
                filter:state.items.filter(item =>{
                    const regex = new RegExp(`${action.payload}`,'gi');
                    return item.name.match(regex) || item.description.match(regex);
                })
            }
         case CLEAR_FILTER:
             return{
             ...state,
            filter:null
         }   
        default:return state;
    }
}