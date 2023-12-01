import React, { useState } from 'react'

export default function NavBar({categories}) {
  const [navIndex,setNavIndex] = useState(null);
  const list = [
    {
      'name':'Home',
    },
    {
      'name':'About'
    },
    {
      'name':'Collections',
      'subNaviagtion': categories
    }
  ]
   function handleSubNavClick(index){
    if(index == navIndex){
      setNavIndex(null) 
      return;
    }
    setNavIndex(index);
  }
  const navList = list.map((item,index)=>
    (
      <li className='relative cursor-pointer text-[#17151A] flex items-center gap-2' key={index} onClick={()=>handleSubNavClick(index)}>
        <span>{item.name}</span>
        {item.subNaviagtion ? (
          <>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          < path stroke="currentColor" d="m1 1 4 4 4-4"/>
          </svg>
          <ul className={navIndex != index ? "hidden" : "absolute border-[1px] bg-white border-[#17151A] text-black p-2 text-sm translate-x-0[-.5rem] top-[100%] right-0"} >
            {item.subNaviagtion.map(nav=> <li className='p-2' key={nav._id}>{nav.category_name.charAt(0).toUpperCase() + nav.category_name.slice(1)}</li>)}
          </ul>
          </>
        ):''}
        
      </li>
    )
  )
  return (
    <nav className='flex items-center px-[25px] py-[15px] justify-between border-b-[1px] border-[#17151A]'>
      <ul className='flex items-center gap-[30px]'>
        {navList}
      </ul>
      <span>
        <img src="https://res.cloudinary.com/doei459zd/image/upload/v1701136032/Bracelet/logo_njdryd.webp" className='w-[35px] h-[35px]'/>
      </span>
      <div className='flex item-center gap-4'>
        <svg className="w-6 h-6  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z"/>
        </svg>
        <svg className="w-6 h-6  dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 11 14H9a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 10 19Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
        </svg>
      </div>
    </nav>
  )
}
