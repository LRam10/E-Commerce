import React from 'react'
import Card from '../common/Card'

export default function PreviewList({items, isLoading}) {
  if (isLoading){
   return [...Array()].map((n,i)=>(
      <div key={i} className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
        <div className="animate-pulse h-[350px] w-[300px]">

        </div>
      </div>
    )
    )
  }
  return items.map(item=>(
    <Card 
    key={item._id}
    item={item}
    />
  ))
}
