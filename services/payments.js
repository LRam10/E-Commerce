exports.handleCheckoutComplete = async(paymentOrder)=>{
  const stripeSessionId = paymentOrder.id;
  const customerDetails = paymentOrder.customer_details;
  const address = customerDetails.address;
  //Note:maybe the decrement should happens at createSession with a tts
  //Then here we'll just update the order status and clear cart
  //Change order status and decrement qty on stripedSessionId

  //check if the order has a user id 

  //If it does clear the users cart

}