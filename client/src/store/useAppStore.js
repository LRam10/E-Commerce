import {create} from 'zustand'

export const useAppStore = create((set) => ({
  isAuthModal:false,
  isLoading:false,
  isSideBarOpen:false,
  setModal:(status)=>{
    set((state)=>({...state, isAuthModal:status}));
  },
  setSideBar:(status)=>{
    set((state)=>({...state, isSideBarOpen:status}));
  }
}))