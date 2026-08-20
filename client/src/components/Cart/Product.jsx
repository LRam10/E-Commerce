import React,{Fragment,useState,useEffect} from 'react'

const Product = ({product,deleteItem,editQty}) => {
    const {img_url,price,qty,_id,name} = product;
    const[item,setItem] = useState(product);
    const onDelete = ()=> deleteItem(_id);
    const onChange = (e)=>{
        setItem({...item,qty:e.target.value});
    }
    useEffect(() => {
        editQty(item)
        // eslint-disable-next-line
    }, [item])
    return (
        <Fragment>
            <div className='flex items-start gap-[12px] px-[17px] sm:gap-[15px]'>
                <div className='flex h-[80px] w-[80px] shrink-0 items-center justify-center rounded-card bg-sol-cream p-2 sm:h-[96px] sm:w-[96px]'>
                    <img src={img_url} alt={name} className='max-h-full max-w-full object-contain'/>
                </div>

                <div className='flex min-w-0 flex-1 flex-col gap-[8px]'>
                    <div className='flex items-start justify-between gap-3'>
                        <span className='truncate font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black'>{name}</span>
                        <span className='shrink-0 font-display text-[16px] font-medium leading-[18px] tracking-[0.18px] text-black'>&#36;{price}</span>
                    </div>

                    <span className='text-[14px] leading-[21px] text-sol-gray'>In stock</span>

                    <div className='flex items-center justify-between gap-3'>
                        {/* <select
                            className="sol-input h-[40px] rounded-pill border border-sol-stroke-light bg-white px-4 text-[14px] text-black outline-none"
                            name='qty'
                            aria-label={`Quantity for ${name}`}
                            defaultValue={qty}
                            onChange={onChange}>
                            {[...Array(10)].map((_,i)=>(<option key={i+1}>{i+1}</option>))}
                        </select> */}
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
