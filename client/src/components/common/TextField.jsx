import React from 'react'

const TextField = ({type,name, placeholder,onChange, formError}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="capitalize">{name}</label>{formError && formError[name] ? <p className="text-red-700 text-[11px]">{formError[name]}</p> : ''}
      <input type={type} name={name} defaultValue={''}  onChange={onChange} autoComplete="on" placeholder={placeholder}/>
    </div>
  )
}

export default TextField
