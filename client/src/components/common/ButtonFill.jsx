import React, { Fragment} from 'react'

export default function ButtonFill({text}) {
  return (
    <Fragment>
      <button className="bg-[#EB0E3C] rounded-[8px] py-[12px] px-[25px] text-white capitalize">
        {text}
      </button>
    </Fragment>
  )
}
