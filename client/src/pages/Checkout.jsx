import React, { useState, useMemo } from "react";
import { redirect, useLoaderData } from "react-router-dom";

import {
  PaymentElement,
  ContactDetailsElement,
  BillingAddressElement,
  CheckoutElementsProvider,
  useCheckoutElements
} from '@stripe/react-stripe-js/checkout';
import { stripePromise, checkoutAppearance } from "../utils/stripe";

import ItemList from '../components/Cart/ItemList';
import { userCartStore, MAX_QTY } from "../store/userCartStore";
import { callAPI } from "../utils/utils";


//Runs on navigation, outside render, so the session is created once per entry to
///checkout. Nothing here needs memoizing because nothing here reruns on a render
export const checkoutLoader = async () => {
  const cartItems = userCartStore.getState().cartItems;
  const cartId = userCartStore.getState().cartId;
  //An empty cart has no line items, so there is no session to create
  if(cartItems.length === 0) return redirect('/');

  const {clientSecret} = await callAPI('/checkout/create-checkout-session','POST',null,'json',{
    //Only the identity and the count travel, the server prices the order
    cartId,
  });
  return {clientSecret};
};

const CheckoutForm = () => {
  const cartItems = userCartStore.getState().cartItems;
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkoutState = useCheckoutElements();

  if (checkoutState.type === 'loading') {
    return (
      <div>Loading...</div>
    );
  }

  if (checkoutState.type === 'error') {
    return (
      <div>Error: {checkoutState.error.message}</div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {checkout} = checkoutState;
    setIsSubmitting(true);

    const confirmResult = await checkout.confirm();

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (confirmResult.type === 'error') {
      setMessage(confirmResult.error.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="py-[1rem] px-[3rem] flex justify-between gap-[1rem] flex]">
      <form onSubmit={handleSubmit} className="flex flex-col gap-[1rem] p-[1rem] w-[65%]">
        <h4>Contact Details</h4>
        <ContactDetailsElement/>
        <h4>Billing Address</h4>
        <BillingAddressElement/>
        <h4>Payment</h4>
        <PaymentElement id="payment-element" />
        <button disabled={!checkoutState.checkout.canConfirm || isSubmitting} id="submit"
        className={`h-[56px] w-full rounded-pill border border-sol-stroke ${!checkoutState.checkout.canConfirm || isSubmitting ?
        'text-gray-500 bg-gray-200 opacity-1 cursor-not-allowed ' : 'bg-sol-red text-white transition-colors hover:bg-sol-red-dark focus-visible:outline-sol-ink'}  text-[15px] font-medium  sm:h-[60px]`}>
          {isSubmitting ? (
            <div className="spinner"></div>
          ) : (
            `Pay ${checkoutState.checkout.total.total.amount} now`
          )}
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
      <ItemList allowEdit={false} cartItems={cartItems}/>
    </div>
  );
}

const CheckoutPage = () => {
  //The loader has already resolved this, so the provider inits with a real secret
  //on its first render and never sees the value change
  const {clientSecret} = useLoaderData();

  return (
    <CheckoutElementsProvider
      stripe={stripePromise}
      options={{
        clientSecret,
        elementsOptions:{appearance:checkoutAppearance},
        adaptivePricing:{
          allowed:false
        }
      }}>
      <CheckoutForm />
    </CheckoutElementsProvider>
  );
}

export default CheckoutPage
