import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer';
import { useQuery } from '@tanstack/react-query';
import AuthModal from '../components/Auth/AuthModal';
import { callAPI } from '../utils/utils';
import { useAppStore } from '../store/useAppStore';
import { Outlet } from 'react-router-dom';
import Cart from '../components/pages/Cart';
export default function PageLayout() {
  // Queries
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => callAPI('/categories', 'GET'),
    retry:2,
  }
  );
  const isModal = useAppStore((state)=>state.isAuthModal);
  const sideBar = useAppStore((state)=>state.isSideBarOpen);
  const setSideBar = useAppStore((state)=>state.setSideBar);
  return (
    <>
     {sideBar && (
        <div className="w-[35%] h-full fixed top-0 right-0 bg-white z-50 p-4 border-l border-gray-200 z-[100]">
          <button onClick={()=> setSideBar(false)} aria-label="Close cart" className="p-2 text-[#17151A] hover:text-[#EB0E3C]">
            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
            </svg>
          </button>
          <Cart sideBar={sideBar} setSideBar={setSideBar} />
        </div>
      )}
    <NavBar categories={query.data}/>
    {isModal ? <AuthModal/> : null }
      <Outlet/>
    <Footer />
    </>
  )
}
