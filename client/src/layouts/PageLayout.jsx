import React,{Fragment} from 'react'
import NavBar from './NavBar'
export default function PageLayout({children}) {
  return (
    <>
    <NavBar/>
    {children}
    </>
  )
}
