import {useEffect,useContext} from 'react';
import CartContext from '../context/cart/cartContext';
import AuthContext from '../context/auth/authContext'

export const useExpiration = () =>{
    const cartContext = useContext(CartContext);
    const { products, createCart,inDB,updateDbCart } = cartContext;
    const authContext =  useContext(AuthContext);
    const { isAuthenticated } = authContext
    useEffect(()=>{
        localStorage.setItem('inDB', JSON.stringify(inDB));
        localStorage.setItem('cart',JSON.stringify(products));
    },[inDB,products]);
    useEffect(()=>{
        if(!localStorage.cart_expiration){
            console.log('Expiraion Set')
            localStorage.setItem('cart_expiration',JSON.stringify(Math.floor(new Date().getTime()/1000.0)+3600));
          }
        let curr = Math.floor(new Date().getTime()/1000.0);
        if( JSON.parse(localStorage.getItem('cart_expiration')) <= curr && isAuthenticated){
            if(inDB)
                updateDbCart(products);
            else
                createCart(products);
            return () =>{
                console.log('new cart expiration set')
                localStorage.setItem('cart_expiration',JSON.stringify(Math.floor(new Date().getTime()/1000.0+3600)))
            };
        }
        //eslint-disable-next-line
    },[])
};