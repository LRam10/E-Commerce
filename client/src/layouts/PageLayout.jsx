import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer';
import { useQuery } from '@tanstack/react-query';
import AuthModal from '../components/Auth/AuthModal';
import { callAPI } from '../utils/utils';
import { useAppStore } from '../store/useAppStore';
export default function PageLayout({children}) {
  // Queries
  const query = useQuery({ queryKey: ['categories'], queryFn: ()=>callAPI('/categories', 'GET') });
  const isModal = useAppStore((state)=>state.isAuthModal);
  return (
    <>
    <NavBar categories={query.data}/>
    {isModal ? <AuthModal/> : null }
    {children}
    <Footer />
    </>
  )
}
