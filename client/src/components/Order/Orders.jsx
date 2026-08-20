import React, { Fragment } from 'react'
import Order from './Order';

const Orders = ({ orders }) => {
    return (
        <Fragment>
            <p className="pt-[14px] text-[15px] leading-[21px] text-sol-gray">
                Total orders: {orders.length}
            </p>
            <div className="flex flex-col gap-[15px] pt-[14px] sm:gap-[17px]">
                {orders.map(order => (
                    <div className="overflow-hidden rounded-card border border-sol-stroke-light" key={order._id}>
                        <Order order={order} />
                    </div>
                ))}
            </div>
        </Fragment>
    )
}

export default Orders
