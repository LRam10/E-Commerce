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
  const queryClient = useQueryClient();
  const {mutate, isSuccess, isPending} = useMutation({
    mutationFn:(user)=>callAPI('/auth', 'POST', null, 'json',user),
    onSuccess:(data)=>{
      queryClient.invalidateQueries({queryKey:['user']});
      setToken(data.token);
      setModal(false);
    }
  })
  const handleLogin  = (e)=>{
    e.preventDefault();
    mutate(user);
  }
  useOutsideClick(handleCloseModal, modalRef);
  function handleCloseModal() {
      setModal(false);
  }
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: tokenResponse => googleLogin(tokenResponse),
  });
  const onChange = (event) => {
    setUser(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }
  return (
    <div className="fixed w-full h-full bg-[#0006] top-0 z-10 flex items-center justify-center" >
      <div className="flex flex-col bg-white border-[1px] gap-2 border-[1p] px-[35px] py-[30px] w-[550px]  rounded-lg" ref={modalRef}>
        <H3>
          Welcome Back
        </H3>
        <div className=" flex items-center  font-extralight">
          <p>New User?</p>
          <a href="" className="text-blue">Create New Account</a>
        </div>

        <form className="flex flex-col gap-[35px]">
          <TextField 
          type={'text'}
          name={'email'}
          placeholder={'Enter your email'}
          onChange={onChange}/>
          <TextField 
          type={'password'}
          name={'password'}
          placeholder={'Password'}
          onChange={onChange}/>
      
          <ButtonFill text={'Submit'} onClick={handleLogin}/>
        </form>
        <hr className="border-[.5px] border-[#c9c9c9] my-[24px]"/>
        <ButtonOutline text={'Continue With Google'} color={'#EB0E3C'} onClick={handleGoogleLogin}/>
      </div>
    </div>
  )
}

export default AuthModal
