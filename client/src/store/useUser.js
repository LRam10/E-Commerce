import { create } from 'zustand'
import { callAPI } from '../utils/utils';
export const useUser = create((set)=>({
  user:null,
  isAuthenticated:false,
  isLoading:false,
  errorMessage:null,
  access_token:localStorage.getItem('access_token'),
  setUser:(user)=> set((state)=>({...state, user, isAuthenticated: !!user})),
  setToken:async (token)=>{
    set((state)=>({...state,access_token:token}));
    if(!token)
      localStorage.removeItem('access_token');
  },
  logOut:async ()=>{
    await callAPI('/auth/logout', 'POST');
    localStorage.removeItem('access_token');
    set((state)=>({...state, user:null, isAuthenticated:false, access_token:null}));
  }
}))