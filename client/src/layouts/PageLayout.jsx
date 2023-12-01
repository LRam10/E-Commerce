import React from 'react'
import NavBar from './NavBar'
import { getCategories } from '../context/category/CategoryState';
import { useQuery } from '@tanstack/react-query';
export default function PageLayout({children}) {
  // Queries
  const query = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  return (
    <>
    <NavBar categories={query.data}/>
    {children}
    </>
  )
}
