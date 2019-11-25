import React,{Fragment} from 'react';
import ItemsOrder from './ItemsOrder';

const Order = ({order}) => {
    order.order_date = new Date(order.order_date).toDateString();
    order.address_city = order.address_city.slice(0,1)+ order.address_city.slice(1,order.address_city.length).toLowerCase();
    return (
        <Fragment>
            <div className='bg-light d-flex border-bottom'>
                <ul className='p-2 my-2' style={spaceBetween}>
                    <li className='d-inline-block'><small><b>Order Placed:</b><br/> {order.order_date}</small></li>
                    <li className='d-inline-block mx-3'><small><b>Total:</b><br/> ${order.total}</small></li>
                    <li className='d-inline-block mx-3'><small><b>Payment Type:</b><br/> {order.payment_type}</small></li>
                    <li className='d-inline-block mx-5'><small><b>Shipped to:</b></small><br/>
                    {`${order.address_street}, ${order.address_city}, ${order.address_state}, ${order.address_postal}`}</li>
                </ul>
            </div>
            <div >
                <ItemsOrder items={order.items}/>
            </div>
        </Fragment>
    )
}
const spaceBetween = {
    lineHeight:'1'
}

export default Order
