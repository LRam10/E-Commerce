import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer';
import { useQuery } from '@tanstack/react-query';
import AuthModal from '../components/Auth/AuthModal';
import { callAPI } from '../utils/utils';
import { useAppStore } from '../store/useAppStore';
import { Outlet } from 'react-router-dom';
export default function PageLayout() {
  // Queries
  const query = useQuery({
    queryKey: ['categories'],
    queryFn: () => callAPI('/categories', 'GET'),
    retry:2,
  }
  );
  const isModal = useAppStore((state)=>state.isAuthModal);
  return (
    <>
    <NavBar categories={query.data}/>
    {isModal ? <AuthModal/> : null }
      <Outlet/>
    <Footer />
    </>
  )
}
