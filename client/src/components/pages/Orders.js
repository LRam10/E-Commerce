import React,{Fragment,useContext,useEffect} from 'react';
import OrderContext from '../../context/order/orderContext';
import OrdersHistory from '../../components/Order/Orders';
const Orders = () => {
    const orderContext = useContext(OrderContext);
    const{ orders,getOrders } = orderContext
    useEffect(()=>{
        getOrders()
        // eslint-disable-next-line 
    },[])

    return (
        <Fragment>
            <div className='container-fluid'>
            <h3>Your Orders</h3>
                <OrdersHistory orders={orders}></OrdersHistory>
            </div>

        </Fragment>
    )
};

export default Orders
