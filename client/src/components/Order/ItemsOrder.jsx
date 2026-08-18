import React from 'react';
import Item from './Item';

const ItemsOrder = ({items}) => {
    return (
             <div>
                <div> 
                {items.map(item=>(
                    <div className='d-flex my-2' key={item._id}>
                        <Item item={item}/>
                    </div>
                ))}
                </div>
            </div>
    )
}

export default ItemsOrder
