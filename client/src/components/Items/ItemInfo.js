import React,{useContext,useState,useEffect} from 'react';
import ItemContext from '../../context/item/itemContext';
import CartContext from '../../context/cart/cartContext';
import AlertContext from '../../context/alerts/alertContext';

const ItemInfo = () => {
    const itemContext = useContext(ItemContext);
    const { currentItem } = itemContext;
    const { img_url,description,price,_id,sku,name } = currentItem;

    const alertContext = useContext(AlertContext);
    
    const cartContext = useContext(CartContext);
    const {addToCart,products} = cartContext;
    const[item,setItem] = useState({
        _id,
        img_url,
        sku,
        name,
        description,
        price,
        qty:1
    });
    const[inCart,setInCart] = useState(false);
    let{ qty } = item;
    useEffect(()=>{
        localStorage.setItem('cart', JSON.stringify(products));
        // eslint-disable-next-line
    },[products])
    const onMinusItem = ()=>{
        if(item.qty === 1){
            return;
        }
        setItem({...item,qty:--qty})
    }
    const onPlusItem = ()=>{
        if(item.qty === 10){
            return;
        }
        setItem({...item,qty:++qty})
    }
    const onAddToCart = ()=>{
        for (let i = 0; i < products.length; i++) {
            if(item._id === products[i]._id){
                alertContext.setAlert('Item Already in Cart','danger');
                setInCart(true);
                return;
            } 
        }
        if(inCart) 
            return;
        else 
            addToCart(item);
    }
    return (
        <div className='container'>
            <div className='row mt-3'>
                <div className='col-xl-6'>
            <img src={img_url} alt='item-img' height='400' width='400' className='img-thumbnail my-4 img-fluid'></img>
                </div>
                <div className='col-xl-6'>
                <h4 className='m-3'>{name}</h4>
                <p className='m-3'><b>${price}</b></p>
                <span id='qty' className='ml-3'>QTY</span>
                <div className="btn-group d-block ml-3" role="group" >
                    <button type="button" className="btn btn-secondary" onClick={onMinusItem}>-</button>
                    <button type="button" className="btn btn-secondary">{item.qty}</button>
                    <button type="button" className="btn btn-secondary" onClick={onPlusItem}>+</button>
                </div>
                <button className='btn btn-blue btn-large px-2 m-3' onClick={onAddToCart}>ADD TO CART</button>
                <h5 className='ml-3'>Description</h5>
                <p className='ml-3 text-muted'>{description}</p>
                </div>
                
            </div>
        </div>
    )
}
export default ItemInfo