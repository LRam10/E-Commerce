import React,{ useContext,useState} from 'react';
import CartContext from '../../context/cart/cartContext';
import AuthContext from '../../context/auth/authContext';

import {CardElement,useStripe,useElements } from '@stripe/react-stripe-js';

const Form = ({grandTotal,products,toggleForm}) => {
    //state for form
    const[billingInfo,setInfo] = useState({
        name:'',
        email: '',
        city: '',
        line1: '',
        state: '',
        postal_code:''
    });
    const onChange = (e)=>{
        setInfo({...billingInfo,[e.target.name]:e.target.value});
    }
    //context
    const cartContext = useContext(CartContext);
    const authContext = useContext(AuthContext);
    const {authCheckout,checkOut} = cartContext;
    //for stripe
    const stripe = useStripe();
    const elements = useElements();
    //submit form
    const onHandle =async(e)=>{
        const {name,email,city,line1,state,postal_code} = billingInfo;
        e.preventDefault();
        const {error,paymentMethod} = await stripe.createPaymentMethod({
            type:'card',
            card:elements.getElement(CardElement),
            billing_details:{
                name,
                email,
                address:{
                    city,
                    line1,
                    state,
                    postal_code,
                    country:'us'
                }
            }
        });
        if(!error){
            console.log(paymentMethod);
            if(authContext.isAuthenticated){
                authCheckout(paymentMethod,grandTotal.toFixed(2)*100,products);
            }
            else
                checkOut(paymentMethod,grandTotal.toFixed(2)*100,products);
            //call checkout function
        }  
    }
    const cardOptions = {
        hidePostalCode:true,
        style:{
            base:{
            //for any styling
            }
        }
    }
    return (
        <div className='modal'>
            <div className='modal-dialog'>
                <div className="modal-content">
                <div className='modal-header'>
                    <button type='button' className='close' data-dismiss='modal'>
                        <span aria-hidden='true' onClick={toggleForm}>&times;</span>
                    </button>
                </div>
            <div className='modal-body bg-light'>
                        <form onSubmit={onHandle}>
                        <div className='form-group'>
                            <input className='form-control' name='name' placeholder='Name' defaultValue='' onChange={onChange} required/>
                        </div>
                        <div className='form-group'>
                            <input className='form-control' type='email' name='email' placeholder='Email' onChange={onChange} required />
                        </div>
                        <div className='form-group'>
                            <input className='form-control' type='text' name='line1' placeholder='Street #, Street Name, Apt..' onChange={onChange} required/>
                        </div>
                        <div className='form-row'>
                            <div className='form-group col-6'>
                                <input className='form-control' type='text' name='city' placeholder='City/Town' onChange={onChange} required/>
                            </div>
                            <div className='form-group col-2'>
                                <select className='form-control' name='state' onChange={onChange}>
                                <option defaultValue='Choose...'></option>
                                    <option value="AL">AL</option>
                                    <option value="AK">AK</option>
                                    <option value="AZ">AZ</option>
                                    <option value="AR">AR</option>
                                    <option value="CA">CA</option>
                                    <option value="CO">CO</option>
                                    <option value="CT">CT</option>
                                    <option value="DE">DE</option>
                                    <option value="DC">DC</option>
                                    <option value="FL">FL</option>
                                    <option value="GA">GA</option>
                                    <option value="HI">HI</option>
                                    <option value="ID">ID</option>
                                    <option value="IL">IL</option>
                                    <option value="IN">IN</option>
                                    <option value="IA">IA</option>
                                    <option value="KS">KS</option>
                                    <option value="KY">KY</option>
                                    <option value="LA">LA</option>
                                    <option value="ME">ME</option>
                                    <option value="MD">MD</option>
                                    <option value="MA">MA</option>
                                    <option value="MI">MI</option>
                                    <option value="MN">MN</option>
                                    <option value="MS">MS</option>
                                    <option value="MO">MO</option>
                                    <option value="MT">MT</option>
                                    <option value="NE">NE</option>
                                    <option value="NV">NV</option>
                                    <option value="NH">NH</option>
                                    <option value="NJ">NJ</option>
                                    <option value="NM">NM</option>
                                    <option value="NY">NY</option>
                                    <option value="NC">NC</option>
                                    <option value="ND">ND</option>
                                    <option value="OH">OH</option>
                                    <option value="OK">OK</option>
                                    <option value="OR">OR</option>
                                    <option value="PA">PA</option>
                                    <option value="RI">RI</option>
                                    <option value="SC">SC</option>
                                    <option value="SD">SD</option>
                                    <option value="TN">TN</option>
                                    <option value="TX">TX</option>
                                    <option value="UT">UT</option>
                                    <option value="VT">VT</option>
                                    <option value="VA">VA</option>
                                    <option value="WA">WA</option>
                                    <option value="WV">WV</option>
                                    <option value="WI">WI</option>
                                    <option value="WY">WY</option>
                                </select>
                            </div>
                            <div className='form-group col-4'>
                                <input className='form-control' name='postal_code' placeholder='Zip Code' required onChange={onChange}/>
                            </div>
                        </div>
                        <CardElement options={cardOptions}/>
                        <div className='modal-footer'>
                        <div className='form-group'>
                            <button className='form-control btn-dark'disabled={!stripe}>
                                Pay</button>
                        </div>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Form;