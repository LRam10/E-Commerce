import React, { useRef, useState} from 'react'
import H3 from '../common/H3';
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
      setModal(false);
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
    onSuccess:()=>{
      queryClient.invalidateQueries({queryKey:['user']});
      setModal(false);
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
  const CloseButton = () => (
    <button
      type="button"
      aria-label="Close"
      onClick={handleCloseModal}
      className="absolute right-[20px] top-[20px] flex h-[32px] w-[32px] items-center justify-center rounded-full text-sol-gray transition-colors hover:bg-sol-page hover:text-sol-ink"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
        <path d="M5 5 19 19M19 5 5 19" />
      </svg>
    </button>
  )
  const GoogleButton = () => (
    <button
      type="button"
      onClick={handleGoogleLogin}
      className="flex h-[60px] w-full items-center justify-center gap-[10px] rounded-pill border border-sol-stroke bg-white text-[15px] font-medium text-sol-ink transition-colors hover:bg-sol-cream"
    >
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17Z"/>
        <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46Z"/>
        <path fill="#FBBC05" d="M11.69 28.18A13.2 13.2 0 0 1 11 24c0-1.45.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7Z"/>
        <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07Z"/>
      </svg>
      Continue with Google
    </button>
  )
  const logingView = ()=>
  (
    <div className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-y-auto rounded-panel bg-white px-[24px] py-[40px] sm:px-[48px] sm:py-[52px]" ref={modalRef}>
      <CloseButton />
      <H3>
        Log in
      </H3>

      <form className="mt-[36px] flex flex-col gap-[12px]">
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

        <button
          type="submit"
          onClick={handleLogin}
          className="mt-[24px] h-[60px] w-full rounded-pill bg-sol-ink text-[15px] font-medium text-white transition-colors hover:bg-sol-gray"
        >
          Sign in
        </button>
      </form>

      <button
        type="button"
        onClick={handleCloseModal}
        className="mx-auto mt-[20px] text-[14px] font-medium text-sol-ink underline underline-offset-4"
      >
        or return to store
      </button>

      <div className="my-[28px] flex items-center gap-[14px]">
        <span className="h-px flex-1 bg-sol-stroke-light" />
        <span className="text-[13px] text-sol-gray">or</span>
        <span className="h-px flex-1 bg-sol-stroke-light" />
      </div>

      {formError?.google && <p className="mb-[12px] text-center text-[13px] text-sol-red">{formError.google}</p>}
      <GoogleButton />

      <p className="mt-[28px] text-center text-[14px] text-sol-gray">
        Don`t have an account?{' '}
        <span className="cursor-pointer font-medium text-sol-ink underline underline-offset-4" onClick={()=>setLoginView(false)}>Sign up</span>
      </p>
    </div>

  )
  const singUpView = ()=>(
    <div className="relative flex max-h-[92vh] w-full max-w-[560px] flex-col overflow-y-auto rounded-panel bg-white px-[24px] py-[40px] sm:px-[48px] sm:py-[52px]" ref={modalRef}>
      <CloseButton />
      <H3>
        Create account
      </H3>

      <form className="mt-[36px] flex flex-col gap-[12px]">
        <TextField
          type={'text'}
          name={'firstName'}
          placeholder={'Enter your name'}
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
          type={'text'}
          name={'email'}
          placeholder={'Enter your email'}
          onChange={onSingupChange}
          formError={formError} />
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

        <button
          type="submit"
          onClick={handleSignUp}
          className="mt-[24px] h-[60px] w-full rounded-pill bg-sol-ink text-[15px] font-medium text-white transition-colors hover:bg-sol-gray"
        >
          Create account
        </button>
      </form>

      <button
        type="button"
        onClick={handleCloseModal}
        className="mx-auto mt-[20px] text-[14px] font-medium text-sol-ink underline underline-offset-4"
      >
        or return to store
      </button>

      <div className="my-[28px] flex items-center gap-[14px]">
        <span className="h-px flex-1 bg-sol-stroke-light" />
        <span className="text-[13px] text-sol-gray">or</span>
        <span className="h-px flex-1 bg-sol-stroke-light" />
      </div>

      {formError?.google && <p className="mb-[12px] text-center text-[13px] text-sol-red">{formError.google}</p>}
      <GoogleButton />

      <p className="mt-[28px] text-center text-[14px] text-sol-gray">
        Already have an account?{' '}
        <span className="cursor-pointer font-medium text-sol-ink underline underline-offset-4" onClick={()=>setLoginView(true)}>Log in</span>
      </p>
    </div>
  )

  return (
    <div className="fixed top-0 z-10 flex h-full w-full items-center justify-center bg-[#0006] px-[16px] py-[24px]">
      {isLoginView ? logingView() : singUpView()}
    </div>
  )

}

export default AuthModal
