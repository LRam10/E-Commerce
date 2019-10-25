import React from 'react'

const Item= (props)=> {
    const {img_url,category,price,description} = props.item
    return (
            <div className='card'>
                <img src={img_url} className='card-img-top' alt={`${category}-pic`}/>
                <div className='card-body card-container'>
                    <h4>{category}</h4>
                    <h5>${price}</h5>
                    <div className='card-text'>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
    )
}

export default Item
