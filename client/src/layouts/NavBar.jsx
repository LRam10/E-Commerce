import React, { useState,useRef } from 'react'
import { Link } from 'react-router-dom';
import { useOutsideClick } from '../CustomHooks/useClickOutside';
import { useUser } from '../store/useUser';
import { useAuthUser } from '../CustomHooks/useAuthUser';
import { useAppStore } from '../store/useAppStore';
import { userCartStore } from '../store/userCartStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserOptions from '../components/helpers/UserOptions';
import ButtonFill from '../components/common/ButtonFill';
export default function NavBar({categories}) {
  const setSideBar = useAppStore((state)=>state.setSideBar);
  const { logOut} = useUser();
  const cartCount = userCartStore((state)=>state.cartItems.length);
  const saveCart = userCartStore((state)=>state.saveCart);
  const clearCart = userCartStore((state)=>state.clearCart);
  const [navIndex,setNavIndex] = useState(null);
  const outerRef = useRef();
  useOutsideClick(closeSubMenu, outerRef);
  //user store
  const queryClient = useQueryClient();
  const { data:user } = useAuthUser();
  const { mutate:logOutMutation } = useMutation({
    mutationFn:async ()=>{
      //Order matters, the cart POST is cookie-authenticated so it has to land before logout
      await saveCart();
      clearCart();
      userCartStore.persist.clearStorage();
      await logOut();
    },
    //Drop the cached user so the nav flips back to Sign In, no refetch needed
    onSuccess:()=> queryClient.setQueryData(['user'], null),
  })
  const list = [
    {
      'name':'Home',
      'path':'/',
    },
    {
      'name':'About'
    },
    {
      'name':'Collections',
      'subNavigation': categories
    }
  ]
  const setAutModal = useAppStore((state)=>state.setModal);
  function handleSingIn(e){
    e.stopPropagation();
    setAutModal(true);
  }
  function handleLogout(){
    logOutMutation()
  }
  function closeSubMenu(){
    setNavIndex(null);
  }
  function toggleNavIndex(e,index){
    e.stopPropagation();
    if(navIndex)
      setNavIndex(null);
    else
      setNavIndex(index)
  }
  const navList = list.map((item,index)=>
    (
      <li className='relative cursor-pointer text-[#17151A] flex items-center gap-2 px-3' key={index} onClick={(e)=>toggleNavIndex(e,index)}>
        <span >{item.path ? <Link to={item.path}>{item.name}</Link> : item.name}</span>
        {item.subNavigation ? (
          <>
          <svg  className={navIndex != index ? 'w-3 h-3 rotate-[-90deg]' : 'w-3 h-3'} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          < path stroke="currentColor" d="m1 1 4 4 4-4" />
          </svg>
          <ul className={navIndex != index ? "hidden" : "absolute border-[1px] bg-white border-[#17151A] text-black text-sm translate-x-0[-.5rem] top-[100%] right-0"}  >
            {item.subNavigation.map(nav=> <li className='py-2 px-3 capitalize hover:bg-[#EB0E3C] hover:text-white hover:scale-105' key={nav._id}><Link to={`/category/${nav.category_name}`} className='block'>{nav.category_name.replace('-', ' ')}</Link></li>)}
          </ul>
          </>
        ):''}
        
      </li>
    )
  )
  return (
    <nav className='flex items-center px-[64px] py-[15px] h-[72px] justify-between'>
      <ul className='flex items-center divide-x ' ref={outerRef}>
        {navList}
      </ul>
      <span>
        <img src="https://res.cloudinary.com/doei459zd/image/upload/v1701136032/Bracelet/logo_njdryd.webp" className='w-[35px] h-[35px]'/>
      </span>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          {cartCount > 0 && (
            <span className='absolute z-[5] h-4 w-4 bg-[#EB0E3C] border-solid border-[1px] border-grey rounded-full text-xs text-white top-[-4px] right-[-10px] flex items-center justify-center'>{cartCount}</span>
          )}
          <svg onClick={setSideBar} className="w-6 h-6  dark:text-white cursor-pointer text-[#EB0E3C]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
            <path stroke="#404040" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z"/>
          </svg>
        </div>
        {
          user ? 
          <UserOptions user={user} onLogout={handleLogout}/> : (
            
            <ButtonFill text={'Sign In'} onClick={handleSingIn}/>
          )
        }
        
      </div>
    </nav>
  )
}
