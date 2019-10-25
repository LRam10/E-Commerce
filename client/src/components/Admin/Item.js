import React from 'react'

const Item= (props)=> {
    const {img_url,category,price,description,sku} = props.item
    return (
            <div className='card'>
                <img src={img_url} className='card-img-top' alt={`${category}-pic`}/>
                <div className='card-body'>
                    <span>{sku}</span>
                    <h4>{category}</h4>
                    <h5>${price}</h5>
                    <div className='card-text'>
                        <p>{description}</p>
                    </div>
                    <div className='text-center'>
                        <button className='btn btn-md btn-danger'>Delete</button>
                        <buton className='ml-2 btn btn-md btn-success'>Edit</buton>
                    </div>
                </div>
            </div>
    )
}

export default Item