import React,{Fragment} from 'react'
import Order from './Order';
const Orders = ({orders}) => {
    return (
        <Fragment>
            <div className='row'>
             <div className='col-8'>  
             <p>Total Order:{orders.length}</p>
            {orders.map(order=>(
                <div className='my-2 border rounded-top' key={order._id}>
                    <Order order={order}/>
                </div>
            ))}
            </div>
            </div>
        </Fragment>
    )
}

export default Orders
