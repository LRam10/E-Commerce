import React from 'react';
import Item from './Item';

const ItemsOrder = ({ items }) => {
    return (
        <div className="divide-y divide-sol-stroke-light">
            {items.map(item => (
                <div className="p-[15px] sm:p-[17px]" key={item._id}>
                    <Item item={item} />
                </div>
            ))}
        </div>
    )
}

export default ItemsOrder
