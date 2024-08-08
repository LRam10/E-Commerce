import React from 'react'
import NavBar from './NavBar'
import Footer from './Footer';
import { getCategories } from '../context/category/CategoryState';
import { useQuery } from '@tanstack/react-query';
import AuthModal from '../components/Auth/AuthModal';
export default function PageLayout({children}) {
  // Queries
  const query = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  return (
    <>
    <NavBar categories={query.data}/>
    <AuthModal/>
    {children}
    <Footer />
    </>
  )
}
