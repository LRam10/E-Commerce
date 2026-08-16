import {create} from 'zustand'

export const useAppStore = create((set) => ({
  isAuthModal:false,
  isLoading:false,
  setModal:(status)=>{
    set((state)=>({...state, isAuthModal:status}));
  }
}))