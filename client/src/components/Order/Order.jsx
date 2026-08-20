import React, { Fragment } from 'react';
import ItemsOrder from './ItemsOrder';

const Field = ({ label, children }) => (
    <li className="flex min-w-0 flex-col gap-1">
        <span className="font-display text-[13px] font-medium uppercase tracking-[0.18px] text-sol-gray">
            {label}
        </span>
        <span className="break-words text-[15px] leading-[21px] text-black">{children}</span>
    </li>
);

const Order = ({ order }) => {
    order.order_date = new Date(order.order_date).toDateString();
    order.address_city = order.address_city.slice(0, 1) + order.address_city.slice(1, order.address_city.length).toLowerCase();
    return (
        <Fragment>
            <div className="border-b border-sol-stroke-light bg-sol-cream p-[17px]">
                {/* A wrapping flex row let the long address shove the other fields around */}
                <ul className="grid grid-cols-1 gap-x-[48px] gap-y-[14px] sm:grid-cols-2 xl:grid-cols-4">
                    <Field label="Order placed">{order.order_date}</Field>
                    <Field label="Total">&#36;{order.total}</Field>
                    <Field label="Payment type">{order.payment_type}</Field>
                    <Field label="Shipped to">
                        {`${order.address_street}, ${order.address_city}, ${order.address_state}, ${order.address_postal}`}
                    </Field>
                </ul>
            </div>
            <ItemsOrder items={order.items} />
        </Fragment>
    )
}

export default Order
