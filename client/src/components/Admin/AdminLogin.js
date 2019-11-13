import React,{useContext,useEffect,useState} from 'react'
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alerts/alertContext';

const AdminLogin = (props) => {
    //AutContext init
    const authContext = useContext(AuthContext);
    const {loginAdmin,error,clearErrors,isAdmin} = authContext;
    //AlertContext inti
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    //inti state
    const [user,setUser] = useState({
    email:'',
    password:''
    });
    //form inputs
    const onChange =(e)=>setUser({...user,[e.target.name]:e.target.value});
    const {email,password} = user;
    useEffect(()=>{
        if(isAdmin){
            props.history.push('/admin-login/home');
        }
        if(error){
            setAlert(error,'danger');
            clearErrors();
        }
        //eslint-disable-next-line
    },[isAdmin,error,props.history]);
    //SubmitForm
    const onLogin = (e)=>{
        e.preventDefault();
        loginAdmin({email,password});
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
                <p>Need an account?, Email WBracelets@gmail.com</p>
            </form>
        </div>
    )
}

export default AdminLogin;