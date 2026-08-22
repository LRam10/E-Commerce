import React from 'react'

const H3 = ({children}) => {
  return (
    <h3 className="mt-[10px] text-[clamp(2rem,1.55rem+2.2vw,3rem)] font-medium leading-[1.1] tracking-[-0.04em] text-sol-ink">
      {children}
    </h3>
  )
}

export default H3
