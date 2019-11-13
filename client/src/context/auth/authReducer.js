import { 
LOGIN_SUCCESSFUl,
LOGIN_FAILURE,
REGISTER_SUCCESS,
REGISTER_FAILURE,
USER_LOADED,
AUTH_ERROR,
LOGOUT,
CLEAR_ERRORS,
LOGIN_ADMIN_SUCCESSFUL
} from '../types';

export default (state,action)=>{
    switch(action.type){
        case USER_LOADED: return {
            ...state,isAuthenticated:true,
            loading:false,
            user:action.payload,
            accessType:action.payload.accessType
        };
        case REGISTER_SUCCESS: 
        localStorage.setItem('token',action.payload.token)
        return{
            ...state,
            ...action.payload,
            isAuthenticated:true,
            loading:false
        };
        case REGISTER_FAILURE:
        case AUTH_ERROR:
            localStorage.removeItem('token')
            return{
                ...state,
                token:null,
                isAuthenticated:false,
                loading:false,
                error:action.payload,
                user:null
            }
            case LOGIN_SUCCESSFUl:
                localStorage.setItem('token',action.payload.token);
                return{
                    ...state,
                    ...action.payload,
                    isAuthenticated:true,
                    loading:false
                };
            case LOGIN_ADMIN_SUCCESSFUL: 
            localStorage.setItem('token',action.payload.token);
            return{
                    ...state,
                    ...action.payload,
                    isAuthenticated:true,
                    loading:false,
                    isAdmin:true,
            };
            case LOGIN_FAILURE:
                localStorage.removeItem('token');
                return{
                    ...state,
                    token:null,
                    isAuthenticated:false,
                    loading:false,
                    error:action.payload,
                    user:null
                };  
            case CLEAR_ERRORS:return{
                ...state,error:null
            }
            case LOGOUT:
                localStorage.removeItem('token');
                return{
                    ...state,
                    token:null,
                    isAuthenticated:false,
                    loading:false,
                    error:action.payload,
                    user:null,
                    isAdmin:false 
                }
     default: return{...state};
    };
};