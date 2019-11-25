import React,{useContext,useEffect} from 'react';
import Product from '../../components/Cart/Product';
import Statement from '../../components/Cart/Statement';
import CartContext from '../../context/cart/cartContext';
import AlertContext from '../../context/alerts/alertContext'
import {useExpiration} from '../../utils/useExpiration';

const Cart = () => {
//AuthContext
//CartContext
const cartContext = useContext(CartContext);
const { products,deleteFromCart,editCartQty,success,error,clearErrors } = cartContext;
//AlertContext
const alertContext = useContext(AlertContext);
const deleteItem = (id)=> deleteFromCart(id);
const editQty = (item)=> editCartQty(item);
useEffect(()=>{
    if(error){
        alertContext.setAlert(error,'danger');
    }
    if(success){
        alertContext.setAlert(success,'success');
        clearErrors();
    }
    // eslint-disable-next-line
},[error,success]);
useExpiration();
//Checks current time with expiration time and updates the cart to database for Logged in user

if(!products.length > 0) return(<div className='jumbotron'><h1>You Cart is Currently Empty</h1></div>);

else {
    return (
        <div className='container'>
            <div className='row mt-3 mb-3'>
                <div className='col-lg-8'>
                 <span className='mt-2 mb-2'>Total Items ({products.length})</span>   
                {products.map(product=>(
                    <div className='border m-1 d-flex' key={product._id}>
                        <Product product={product} deleteItem={deleteItem} editQty={editQty}/>
                    </div>
                ))}
                </div>
                <div className='col-lg-4'>
                    <Statement/>
                </div>
            </div>
        </div>
    )
}
}
export default Cart
