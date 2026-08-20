import React, { useEffect, useRef } from 'react'
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
  const panelRef = useRef(null);

  //Escape closes the cart, and an open cart owns the page scroll
  useEffect(() => {
    if (!sideBar) return;
    const onKeyDown = (e) => { if (e.key === 'Escape') setSideBar(false); };
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [sideBar, setSideBar]);

  return (
    <>
     {sideBar && (
        <div className="fixed inset-0 z-[100]">
          <div
            onClick={() => setSideBar(false)}
            aria-hidden="true"
            className="absolute inset-0 bg-black/50"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
            tabIndex={-1}
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-sol-stroke-light bg-white shadow-2xl outline-none lg:w-[38%] lg:max-w-[460px]"
          >
            <div className="flex h-[56px] shrink-0 items-center justify-between border-b border-sol-stroke-light px-[17px]">
              <span className="text-[15px] font-medium text-sol-ink">Your cart</span>
              <button
                onClick={()=> setSideBar(false)}
                aria-label="Close cart"
                className="-mr-[8px] flex h-[40px] w-[40px] items-center justify-center rounded-full text-sol-ink transition-colors hover:bg-sol-page hover:text-sol-red"
              >
                <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1">
              <Cart sideBar={sideBar} setSideBar={setSideBar} />
            </div>
          </div>
        </div>
      )}
    <NavBar categories={query.data}/>
    {isModal ? <AuthModal/> : null }
      <Outlet/>
    <Footer />
    </>
  )
}
