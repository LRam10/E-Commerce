import React,{useReducer} from 'react';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import  {
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
const AuthState = props =>{
    const initialState = {
    token:localStorage.getItem('token'),    
    user:null,
    isAuthenticated:null,
    loading:true,
    error:null,
    isAdmin:null,
    };
    const [state,dispatch] = useReducer(AuthReducer,initialState);

//Load user
const loadUser = async () =>{
    if(localStorage.token){
        setAuthToken(localStorage.token);
    }
  try {
    const response = await axios.get('http://localhost:5000/auth');
    dispatch({type:USER_LOADED,payload:response.data});
  } catch (error) {
      dispatch({type:AUTH_ERROR});
  }
};
//Register User
const registerUser = async (userData) =>{
    try {
        let config = {
            headers:{'Content-Type':'application/json'},
        };
        const response = await axios.post('http://localhost:5000/register',userData,config);
        // const data = await response.json();
        dispatch({type:REGISTER_SUCCESS,payload:response.data});
        loadUser();
    } catch (error) {
    console.log(error.response.data.msg);
     dispatch({type:REGISTER_FAILURE,payload:error.response.data.msg});
    }
};
//clear errors
const clearErrors = () => dispatch({type:CLEAR_ERRORS});
//Authenticate User

//Login User
const loginUser = async user =>{
    let config = {
        headers:{'Content-Type':'application/json'},
    };
    try {
        const response = await axios.post('/auth',user,config);
         dispatch({type:LOGIN_SUCCESSFUl,payload:response.data});
        await loadUser();
    } catch (error) {
        console.log(error)
        dispatch({type:LOGIN_FAILURE,payload:error.response.data.msg})
    }
};
//Logout User
const logout =() => dispatch({type:LOGOUT});

//AdminLogin
const loginAdmin = async user=>{
    let config = {
        headers:{'Content-Type':'application/json'},
    };
    try {
        const response = await axios.post('http://localhost:5000/auth/admin',user,config);
         dispatch({type:LOGIN_ADMIN_SUCCESSFUL,payload:response.data});
         loadUser();
    } catch (error) {
        console.log(error)
        dispatch({type:LOGIN_FAILURE,payload:error.response.data.msg})
    }
}

    return <AuthContext.Provider
    value = {
        {
        user:state.user,
        token:state.token,
        isAuthenticated:state.isAuthenticated,
        error:state.error,
        loading:state.loading,
        isAdmin:state.isAdmin,
        registerUser,
        loadUser,
        clearErrors,
        loginUser,
        logout,
        loginAdmin
        }
    }>
    {props.children}
    </AuthContext.Provider>
};
export default AuthState;