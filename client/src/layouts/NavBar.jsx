import React from 'react'

export default function NavBar() {
  const list = [
    {
      'name':'Home',
    },
    {
      'name':'About'
    }
  ]
  const navList = list.map((item,index)=>
    (
      <li className='font-bold text-slate-600 p-5' key={index}>{item.name}</li>
    )
  )
  return (
    <nav className='flex items-center w-full p-3'>
      {navList}
    </nav>
  )
}
