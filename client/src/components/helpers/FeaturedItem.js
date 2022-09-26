import React from 'react'

const FeaturedItem = ({category,name,description}) => {
  return (
    <div className="fluid-container mt-4 pt-4 pb-5 bg-lblue">
        <h3 className='mb-5 ml-5'><u>Top Seller</u></h3>
        <div className='row'>
            <div className='col-6'>
            <img className='img-fluid shadow-sm' src='https://res.cloudinary.com/doei459zd/image/upload/v1575554850/Bracelet/i38e3nhs5wj2wzsexuky.jpg'/>
            </div>
            <div className='col-6'>
              <span>{category}</span>
              <h4>{name}</h4>
              <p>{description}</p>
            </div>
        </div>
    </div>
  )
}

export default FeaturedItem
