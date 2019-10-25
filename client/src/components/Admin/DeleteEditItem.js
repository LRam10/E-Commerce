import React from 'react'
import Item from '../Admin/Item'

const DeleteEditItems = (props) => {
    const {items} = props;
    return (
        <div className='container-fluid mt-4'>
            <div className='row'>
             {items.map(item =>(
            <div className='col-lg-4 mb-3' key={item.id}>
               <Item item={item}></Item>
           </div>
            ))}
            </div> 
         </div>
    )
}

export default DeleteEditItems
