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

    export default (state,action) =>{
        switch (action.type) {
        case GET_CART:
                return{
                    ...state,
                    products:action.payload.items,
                    inDB:action.payload.active
                }
        case ADD_ITEM_INCART:
            return{
                ...state,
                products:[...state.products,action.payload],
            };
            case REMOVE_ITEM:
                return{
                    ...state,
                    products:state.products.filter(product=> product._id !== action.payload)
                };
            case POST_CART:
                localStorage.removeItem('cart');
                return{
                ...state,
                inDB:true
            };
            case EDIT_ITEM_INCART:return{
                    ...state,
                    products:state.products.map(product => product._id === action.payload._id ?
                    action.payload : product)
                };
            case CHECKOUT_CART:
            case CHECKOUT_AUTH:
                localStorage.removeItem('cart');
                return{
                    ...state,
                    products:[],
                    success:action.payload,
                };
            case CART_ERROR:return{
                ...state,
                error:action.payload
            };
            case CLEAR_ERRORS:return{
                ...state,
                success:null,
                error:null
            };
            case EDIT_DB_CART_LOGOUT:
                localStorage.removeItem('cart');
                localStorage.removeItem('inDB')
                return{
                ...state,
                products:[],
            }
            case UPDATE_CART :
                localStorage.removeItem('cart_expiration');
                return{
                ...state,
                products:action.payload
                }
            default:
                return{...state};
        }
    }