import React,{useState,useContext,useEffect} from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/auth/authContext';
import Alert from '../../context/alerts/alertContext';
import CartContext from '../../context/cart/cartContext';

const Login = (props) => {
    //UserContext init
    const authContext = useContext(AuthContext);
    const { loginUser,error,isAuthenticated,clearErrors, } = authContext;
    //AlertContext
    const alertContext = useContext(Alert);
    const { setAlert } = alertContext;
    //CartContext
    const cartContext = useContext(CartContext);
    const { getCart } = cartContext;
    //Component state
    const[user,setUser] = useState({
        email:'',
        password:'',
    });
    useEffect(()=>{
        if(isAuthenticated || localStorage.token){
            getCart();
            props.history.push('/');
        }
        if(error){
            setAlert(error,'danger');
            clearErrors();
        }
        //eslint-disable-next-line
    },[isAuthenticated,error,props.history]);
    let {email,password} = user;
    const onChange = (e) => setUser({...user,[e.target.name]:e.target.value});
    const onLogin = (e)=>{
        e.preventDefault();
        loginUser({email,password});
    }
    return (
        <div className='container'>
            <form className='mx-auto form-group mt-4 shadow-sm py-5' onSubmit={onLogin}>
            <h3 className='text-center'>Log In</h3>
                <label htmlFor='email'>Email</label>
                <input type='text' name='email' defaultValue={email} className='form-control' onChange={onChange} required></input>
                <label htmlFor='password'>Password</label>
                <input type='password' name='password' defaultValue={password} className='form-control' onChange={onChange} required></input>
                <input type='submit' name='login' className='btn btn-primary mx-auto btn-block m-2' value='Sign Up'/>
                <input type='submit' name='login' className='btn btn-danger mx-auto btn-block m-2' value='Google Account'/>
                <p>Need an account? <Link to={'/register'}>Creat Account</Link></p>
            </form>
        </div>
    )
}

export default Login
