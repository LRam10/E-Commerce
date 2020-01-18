import React from 'react'
import Item from '../../components/Items/Item'

const Items = (props)=> {
    const items = props.items;
    const loading = props.loading;
    return (
        <div className='container-fluid mt-4 mb-4 pb-4'>
            <div className='row'>
             {loading === true ?
             <div className='mx-auto'>
             <div className="spinner-border text-primary" role="status">
                 <span className="sr-only">Loading...</span>
             </div>
         </div>
             :items.map(item =>(
            <div className='col-lg-3 mb-1' key={item._id}>
               <Item item={item}></Item>
           </div>
            ))}
            </div>
         </div>
    )
}

export default Items;