import React, { Fragment} from 'react'

export default function ButtonOutline({text,color}) {
  return (
    <Fragment>
      <button className={`rounded-[8px] border-[1px] capitalize border-[${color}] text-[${color}] py-[12px] px-[25px]`}>
        {text}
      </button>
    </Fragment>
  )
}