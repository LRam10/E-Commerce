import React from 'react'
import Item from '../../components/Items/Item'

const Items = (props)=> {
    const items = props.items
    return (
        <div className='container-fluid mt-4'>
            <div className='row'>
             {items.map(item =>(
            <div className='col-lg-3' key={item._id}>
               <Item item={item}></Item>
           </div>
            ))}
            </div>
         </div>
    )
}

export default Items
