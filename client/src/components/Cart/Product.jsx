import React, { Fragment } from 'react'
import { MAX_QTY } from '../../store/userCartStore'

const Product = ({product,deleteItem,increaseQty,decreaseQty}) => {
    const {img_url,price,qty,_id,name} = product;
    const quantity = Number(qty) || 1;
    const onDelete = ()=> deleteItem(_id);
    return (
        <Fragment>
            <div className='flex items-start gap-[12px] px-[17px] sm:gap-[15px]'>
                <div className='flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-card bg-sol-cream p-2 sm:h-[96px] sm:w-[96px]'>
                    <img src={img_url} alt={name} className='max-h-full max-w-full object-contain'/>
                </div>

                <div className='flex min-w-0 flex-1 flex-col gap-[8px]'>
                    <div className='flex items-start justify-between gap-3'>
                        <span className='truncate font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black'>{name}</span>
                        <span className='shrink-0 font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black'>
                            &#36;{(Number(price) * quantity).toFixed(2)}
                        </span>
                    </div>

                    <span className='text-[14px] leading-[21px] text-sol-gray'>
                        &#36;{Number(price).toFixed(2)} each
                    </span>

                    <div className='flex items-center justify-between gap-3'>
                        <div className='flex h-[40px] items-center gap-[4px] rounded-pill border border-sol-stroke-light px-[6px]'>
                            <button
                                type='button'
                                onClick={()=>decreaseQty(_id)}
                                disabled={quantity === 1}
                                aria-label={`Decrease quantity for ${name}`}
                                className='flex h-[28px] w-[28px] items-center justify-center rounded-full text-[16px] leading-none text-sol-ink transition-colors hover:bg-sol-page disabled:text-sol-track disabled:hover:bg-transparent'>
                                &#8722;
                            </button>
                            <span aria-live='polite' className='min-w-[22px] text-center text-[14px] text-sol-ink'>{quantity}</span>
                            <button
                                type='button'
                                onClick={()=>increaseQty(_id)}
                                disabled={quantity === MAX_QTY}
                                aria-label={`Increase quantity for ${name}`}
                                className='flex h-[28px] w-[28px] items-center justify-center rounded-full text-[16px] leading-none text-sol-ink transition-colors hover:bg-sol-page disabled:text-sol-track disabled:hover:bg-transparent'>
                                &#43;
                            </button>
                        </div>

                        <button
                            type='button'
                            onClick={onDelete}
                            className='shrink-0 text-[14px] leading-[21px] text-sol-red underline underline-offset-2 transition-colors hover:text-sol-red-dark'>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default Product
