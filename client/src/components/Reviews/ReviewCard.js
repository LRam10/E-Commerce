import React from 'react'
import StarRating from '../../utils/Rating/StarRating'

const ReviewCard = ({review}) => {
  return (
    <div className='col-lg-12 mt-2 mb-2'>
      <div className='card w-100  shadow-sm'>
        <div className='card-body'>
            <h5 className='card-title'>{review.headline}</h5>
            <StarRating startsSelected={review.rating}/>
            <p className='card-text'>{review.comments}</p>
        </div>

      </div>
    </div>
  )
}

export default ReviewCard
