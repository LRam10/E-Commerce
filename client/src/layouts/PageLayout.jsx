import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer';
import { getCategories } from '../context/category/CategoryState';
import { useQuery } from '@tanstack/react-query';
import AuthModal from '../components/Auth/AuthModal';
import { useAppStore } from '../store/useAppStore';
export default function PageLayout({children}) {
  // Queries
  const query = useQuery({ queryKey: ['categories'], queryFn: getCategories });
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
