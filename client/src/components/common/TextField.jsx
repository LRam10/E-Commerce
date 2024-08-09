import React from 'react'

const TextField = ({type,name, placeholder,onChange}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="capitalize">{name}</label>
      <input type={type} name={name} defaultValue={''}  onChange={onChange} placeholder={placeholder}/>
    </div>
  )
}

export default TextField
