import React from 'react'
import Star from './Star';

const StarRating = ({handleStars =()=>{},startsSelected}) => {

  return (
    <div className='star-rating d-flex mb-4'>
      {[...Array(5)].map((n,i)=>(
        <Star 
        key={i}
        selected={i<startsSelected}
        onSelect={()=>handleStars(i+1)}/>
      )
      )}
    </div>
  )
}

export default StarRating
