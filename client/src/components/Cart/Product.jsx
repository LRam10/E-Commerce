import React,{Fragment,useState,useEffect} from 'react'

const Product = ({product,deleteItem,editQty}) => {
    const {img_url,price,qty,_id,name} = product;
    const[item,setItem] = useState(product);
    const onDelete = ()=> deleteItem(_id);
    const onChange = (e)=>{
        console.log(e.target.value);
        setItem({...item,qty:e.target.value});
    }
    useEffect(() => {
        editQty(item)
        // eslint-disable-next-line
    }, [item])
    return (
        <Fragment>
            <img src={img_url} height='240' width='240' alt='#' className='float-left img-fluid'/>
            <div className='w-100 p-3'>
            <div className='clearfix'>
                <small>
                <span className='float-left'>{name}</span>
                <span className='float-right'><b>${price}</b></span>
                </small>
            </div>
            <p className=''><b>In Stock</b></p>
            <p className='mt-5 mb-0'><small>Quantity</small></p>
            <select className="form-control mb-5" name='qty' defaultValue={qty} onChange={onChange}>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
            </select>
            <span className='small-text' style={itemCursor} onClick={onDelete}><u>Remove Item</u></span>
            </div>
        </Fragment>
        
    )
}
const itemCursor = {
    cursor:'pointer'
}
export default Product