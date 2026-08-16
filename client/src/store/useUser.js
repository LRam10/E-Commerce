import { create } from 'zustand'

export const useUser = create((set)=>({
  user:null,
  isLoading:false,
  errorMessage:null,
  access_token:localStorage.getItem('access_token'),
  setToken:async (token)=>{
    set((state)=>({...state,access_token:token}));
    if(!token)
      localStorage.removeItem('access_token');
  }
}))