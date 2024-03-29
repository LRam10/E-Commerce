import React,{useState,useContext,useEffect} from 'react';
import { Link } from 'react-router-dom';
import AlertContext from '../../context/alerts/alertContext';
import AuthContext from '../../context/auth/authContext';
const Register = (props) => {
    //AlertContext
    const alertContext = useContext(AlertContext);
    const { setAlert } = alertContext;
    //AutContext
    const authContext = useContext(AuthContext);
    const { registerUser,error,isAuthenticated,clearErrors } = authContext;
    useEffect(()=>{
        if(isAuthenticated || localStorage.token){
            props.history.push('/');
        }
        if(error){
            setAlert(error,'Danger');
            clearErrors();
        }
        //eslint-disable-next-line
    },[error,isAuthenticated,props.history]);
    //Component State
    const[user,setUser] = useState({
        firsName:'',
        lastName:'',
        email:'',
        currentPassword:'',
        confPassword:''
    });
    let {firstName,lastName,email,currentPassword,confPassword} = user;

  const onChange = (e) => setUser({...user,[e.target.name]:e.target.value});

  const onRegister =(e)=>{
      e.preventDefault();
      if(currentPassword !== confPassword){
          setAlert('Passwords do not match','danger');
      }
      else{
        registerUser({firstName,lastName,email,currentPassword});
      }
  }
    return (
        <div className='d-flex align-items-center auth-home'>
            <div className='container'>
            <form className='mx-auto form-group mt-4 shadow-sm' onSubmit={onRegister}>
            <h3 className='text-center'>Create Account</h3>
                    <label htmlFor='firtsName'>First Name</label>
                    <input type='text' defaultValue={firstName} name='firstName' className='form-control' onChange={onChange} required></input>
                
                    <label htmlFor='lastName'>Last Name</label>
                    <input type='text' defaultValue={lastName} name='lastName' className='form-control' onChange={onChange} required></input>
                
                    <label htmlFor='email'>Email</label>
                    <input type='email' name='email' defaultValue={email} className='form-control' onChange={onChange} autoComplete='username' required></input>
                
                    <label htmlFor='password'>Password</label>
                    <input type='password' name='currentPassword' defaultValue={currentPassword} className='form-control' 
                   autoComplete='current-password' onChange={onChange} minLength='6' required></input>
                
                    <label htmlFor='confPassword'>Confirm Password</label>
                    <input type='password' name='confPassword' defaultValue={confPassword} className='form-control' autoComplete='confirm-password' onChange={onChange} minLength='6' required></input>
                    <input type='submit' className='btn btn-primary mx-auto btn-block m-2' value='Sign Up'/>
                    <p>Already have an account? <Link to={'/login'}>Login</Link></p>
            </form>
        </div>
        </div>
        
    )
}

export default Register
