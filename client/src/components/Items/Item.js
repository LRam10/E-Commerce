import React,{useContext,useEffect,useState} from 'react';
import { Link } from 'react-router-dom';

import ItemContext from '../../context/item/itemContext';
import CartContext from '../../context/cart/cartContext';
import AlertContext from '../../context/alerts/alertContext';
const Item= ({item})=> {
    const {img_url,category,price,name,description,_id} = item;
    item.qty = 1;
    const itemContext = useContext(ItemContext);
    const onSetItem = ()=>{
        itemContext.setCurrentItem(item);
    }
    const alertContext = useContext(AlertContext);
    
    const cartContext = useContext(CartContext);
    const {addToCart,products} = cartContext;
    const[inCart,setInCart] = useState(false);

    useEffect(()=>{
      localStorage.setItem('cart', JSON.stringify(products));
      // eslint-disable-next-line
  },[products])

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
            <div className='card border-0 card-corner'>
                <Link to={`/item/${item.name}`} onClick={onSetItem}>
                <img src={img_url} className='card-img-top' alt={`${category}-pic`}/></Link>
                <div className='card-body card-container bg-light'>
                    <div className='btn-add align-items-center d-flex' onClick={onAddToCart}>
                    <i className="fas fa-cart-plus"></i>
                    </div>
                    <h5 className='mb-3'>{name}</h5>
                    <p>{description.substring(0,35)}...</p>
                    <p className='m-0'><b>${price}</b></p>
                </div>
            </div>
    )
}

export default Item
