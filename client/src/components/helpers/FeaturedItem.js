import React, {useContext, useEffect, useState} from 'react'
import CartContext from '../../context/cart/cartContext';
import AlertContext from '../../context/alerts/alertContext';
const FeaturedItem = ({category,name,description,img_url}) => {

  const alertContext = useContext(AlertContext);
    
    const cartContext = useContext(CartContext);
    const {addToCart,products} = cartContext;
    const item = {
        img_url,
        name,
        description,
        price:4.99,
        qty:1
    }
    const[inCart,setInCart] = useState(false);

    useEffect(()=>{
      localStorage.setItem('cart', JSON.stringify(products));
      // eslint-disable-next-line
  },[products])

  const onAddToCart = ()=>{
    for (let i = 0; i < products.length; i++) {
        if(item.name === products[i].name){
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
    <div className="fluid-container mt-4 pt-4 pb-5 bg-lblue">
        <div className='row'>
        <h3 className='mb-5 '><u>Top Seller</u></h3>
        </div>
        <div className='row'>
            <div className='col-sm-6 col-xs-12'>
            <img className='img-fluid shadow-sm featured-item' alt={`${name}-img`} src={img_url}/>
            </div>
            <div className='col-sm-6 col-xs-12'>
              <span className='tag-name pb-2 '>{category}</span>
              <h4 className='my-3'>{name}</h4>
              <p className='m-3'><b>${item.price}</b></p>
              <p>{description}</p>
              <button className="btn btn-blue btn-lg my-3" onClick={onAddToCart} >Add to Cart <i className="fas fa-shopping-cart"></i></button>
            </div>
        </div>
    </div>
  )
}

export default FeaturedItem
