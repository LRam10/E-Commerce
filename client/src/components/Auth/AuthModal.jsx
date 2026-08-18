import React, { useRef, useState} from 'react'
import H3 from '../common/H3';
import ButtonFill from '../common/ButtonFill';
import ButtonOutline from '../common/ButtonOutline';
import {useGoogleLogin} from '@react-oauth/google';
import { useOutsideClick } from '../../CustomHooks/useClickOutside';
import { useUser } from '../../store/useUser';
import { useAppStore } from '../../store/useAppStore';
import TextField from '../common/TextField';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { callAPI } from '../../utils/utils';
const AuthModal = () => {
  const modalRef = useRef();
  //Store
  const setToken = useUser((state)=>state.setToken)
  const setModal = useAppStore((state)=>state.setModal)
  //Component state
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [userSingup, setUserSingup] = useState({
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    rePassword:''
  })
  const [isLoginView, setLoginView] = useState(true)

  const [formError, setFormError] = useState(null);
  //React Query 
  const queryClient = useQueryClient();
  const {mutate:loginMutation, isSuccess, isPending, error} = useMutation({
    mutationFn:(user)=>callAPI('/auth', 'POST', null, 'json',user),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['user']});
      setToken(data.token);
      setModal(false);
      localStorage.setItem('access_token',data.token)
    
    },
    onError:(error)=>{
     error.data.map(err=>{
      setFormError(prev=>({
        ...prev,
        [err.param]: err.msg
      }))
     })
    }
  })
  const {mutate:signupMutation, isSuccess:singupSuccess, isPending:singupPending, error:singupError} = useMutation({
    mutationFn:(user)=>callAPI('/register', 'POST', null, 'json',user),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['user']});
      setToken(data.token);
      setModal(false);
      localStorage.setItem('access_token',data.token)
    
    },
    onError:(error)=>{
     error.data.map(err=>{
      setFormError(prev=>({
        ...prev,
        [err.param]: err.msg
      }))
     })
    }
  })
  const {mutate:googleMutation} = useMutation({
    mutationFn:(tokenResponse)=>callAPI('/auth/google', 'POST', null, 'json', tokenResponse),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['user']});
      setToken(data.token);
      setModal(false);
      localStorage.setItem('access_token',data.token)
    },
    onError:()=>{
      setFormError(prev=>({...prev, google:'Google sign in failed, please try again'}))
    }
  })
  const handleLogin  = (e)=>{
    e.preventDefault();
    loginMutation(user);
  }
  const handleSignUp = (e)=>{
    e.preventDefault();
    if(userSingup.password !== userSingup.rePassword){
      setFormError((prev)=>(
        {
          ...prev,
          rePassword:'Passwords do not match'
        }
      ));
      return;
    }
    signupMutation(userSingup);
  }
  useOutsideClick(handleCloseModal, modalRef);
  function handleCloseModal() {
      setModal(false);
  }
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => googleMutation(tokenResponse),
    onError: () => setFormError(prev=>({...prev, google:'Google sign in failed, please try again'})),
    onNonOAuthError: () => setFormError(prev=>({...prev, google:'Google sign in was cancelled'})),
  });
  const onChange = (event) => {
    setFormError(null);
    setUser(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }
  const onSingupChange =  (event) => {
    setFormError(null);
    setUserSingup(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }
  const logingView = ()=>
  (
    <div className="flex flex-col bg-white border-[1px] gap-2 border-[1p] px-[35px] py-[30px] w-[550px]  rounded-lg" ref={modalRef}>
      <H3>
        Welcome Back
      </H3>
      <div className="text-[14px] flex items-center  font-extralight gap-2 my-3">
        <p>New User?</p>
        <span className="text-cyan-500 cursor-pointer" onClick={()=>setLoginView(false)}>Create New Account</span>
      </div>

      <form className="flex flex-col gap-[35px]">
        <TextField
          type={'text'}
          name={'email'}
          placeholder={'Enter your email'}
          onChange={onChange}
          formError={formError} />
        <TextField
          type={'password'}
          name={'password'}
          placeholder={'Password'}
          onChange={onChange}
          formError={formError} />

        <ButtonFill text={'Submit'} onClick={handleLogin} />
      </form>
      <hr className="border-[.5px] border-[#c9c9c9] my-[24px]" />
      {formError?.google && <p className="text-[12px] text-red-500">{formError.google}</p>}
      <ButtonOutline text={'Continue With Google'} color={'#EB0E3C'} onClick={handleGoogleLogin} />
    </div>

  )
  const singUpView = ()=>(
    <div className="flex flex-col bg-white border-[1px] gap-2 border-[1p] px-[35px] py-[30px] w-[550px]  rounded-lg" ref={modalRef}>
       <H3>
        Create an Account
      </H3>
      <div className="text-[14px] flex items-center  font-extralight gap-2 my-3">
        <p>Already have an account?</p>
        <span className="text-cyan-500 cursor-pointer">Login</span>
      </div>

      <form className="flex flex-col gap-[35px]">
        <TextField
          type={'text'}
          name={'firstName'}
          placeholder={'Enter your name'}
          onChange={onSingupChange}
          formError={formError} />
        <TextField
          type={'text'}
          name={'email'}
          placeholder={'Enter your email'}
          onChange={onSingupChange}
          formError={formError} />
        <TextField
          type={'text'}
          name={'lastName'}
          placeholder={'Enter your last name'}
          onChange={onSingupChange}
          formError={formError}
        />
        <TextField
          type={'password'}
          name={'password'}
          placeholder={'Password'}
          onChange={onSingupChange}
          formError={formError} />
        <TextField
          type={'password'}
          name={'rePassword'}
          placeholder={'Confirm password'}
          onChange={onSingupChange}
          formError={formError}/>

        <ButtonFill text={'Submit'} onClick={handleSignUp} />
      </form>
    </div>
  )

  return (
    <div className="fixed w-full h-full bg-[#0006] top-0 z-10 flex items-center justify-center">
      {isLoginView ? logingView() : singUpView()}
    </div>
  )

}

export default AuthModal
