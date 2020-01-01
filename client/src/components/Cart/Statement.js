import React,{Fragment,useContext} from 'react';
import CartContext from '../../context/cart/cartContext';
import AuthContext from '../../context/auth/authContext';
import StripeCheckout from 'react-stripe-checkout';
let stripeClient;
if(process.env.NODE_ENV !== 'production'){
    stripeClient = process.env.REACT_APP_STRIPE_CLIENT;
}
else{
    stripeClient = process.env.REACT_APP_STRIPE_CLIENT;
}
const Statement = () => {
    //CartContext
    const cartContext =useContext(CartContext);
    const { products,checkOut,authCheckout } = cartContext;
    //AuthContext
    const authContext = useContext(AuthContext);
    let total = 0;
    products.forEach(product => {
        total += product.qty * product.price;
    });
    let tax = total.toFixed() * 0.08250;
    let grandTotal = total + tax;

    const handleToken = (token)=>{
        if(authContext.isAuthenticated){
            authCheckout(token,grandTotal.toFixed(2),products)
        }
        else{
            checkOut(token,grandTotal.toFixed(2),products);
        }
    }
    return (
        <Fragment>
            <div className='w-100 border mt-4 mb-4'>
            <h3 className='py-3 pl-2'><b>Order Summary</b></h3>
            <div className='clearfix px-3'>
                <p className='float-left'>Sub-Total</p>
                <p className='float-right'><b>${total.toFixed(2)}</b></p>
            </div>
            <div className='clearfix px-3'>
                <p className='float-left'>Delivery</p>
                <p className='float-right'><b>--</b></p>
            </div>
            <div className='clearfix px-3'>
                <p className='float-left'>Sale Tax</p>
                <p className='float-right'><b>${tax.toFixed(2)}</b></p>
            </div>
            <div className='clearfix px-3'>
                <p className='float-left'>Total</p>
                <p className='float-right'><b>${grandTotal.toFixed(2)}</b></p>
            </div>
            </div>
            <StripeCheckout
                stripeKey={stripeClient}
                token={handleToken}
                billingAddress
                shippingAddress
                amount={grandTotal.toFixed(2) * 100}
            />

        </Fragment>
    )
}
export default Statement
