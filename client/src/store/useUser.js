import { create } from 'zustand'

export const useUser = create((set)=>({
  user:null,
  isLoading:false,
  errorMessage:null,
  getSubmitUser:async (user)=>{
    //set();
    console.log('user')
  }
}))