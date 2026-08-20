import React from 'react';

const Item = ({ item }) => {
    return (
        <div className="flex items-start gap-[12px] sm:gap-[17px]">
            <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-card bg-sol-cream p-2 sm:h-[120px] sm:w-[120px]">
                <img
                    src={item.img_url}
                    alt={`item-${item.name}`}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-[6px]">
                <h4 className="font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black">
                    {item.name}
                </h4>
                <p className="text-[14px] leading-[21px] text-sol-gray">{item.description}</p>
                <p className="font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black">
                    &#36;{item.price}
                </p>
            </div>
        </div>
    )
}
export default Item;
