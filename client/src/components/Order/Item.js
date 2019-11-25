import React,{Fragment} from 'react';

 const Item = ({item}) => {
    return (
        <Fragment>
            <img src={item.img_url} height='150' width='150' className='float-left' alt={`item-${item.name}`}/>
            <div className='w-100 py-2'>
                <p className='mb-0 ml-2'><b>{item.name}</b></p>
                <p className='mb-0 ml-2'><small>{item.description}</small></p>
                <p className='ml-2'><small>Price: ${item.price}</small></p>
            </div>
        </Fragment>
    )
}
export default Item;