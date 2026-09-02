const { validationResult} = require('express-validator');

const { createStripeSession , getStripeSession, verifySignature } = require('../services/stripe');
const { createOrderDb }= require('../services/orders'); 

const { handleCheckoutComplete } = require('../services/payments');

const { getCart } = require('../services/cart');
exports.createSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cartId } = req.body;
    //Get the items from the cart, and clamp the quantity to the max allowed for each item
    const cart = await getCart(cartId);
    const session = await createStripeSession(cart);
    if(!session){
      res.json({
        msg:'Failed to create session, please try again'
      });
      return;
    }
    //Note might create order somewhere else
    // const totalAmount = session?.amount_total;
    // //TODO: handle guest order
    // const getOrder = await createOrderDb(session.id, finalItems, 'pending', totalAmount);
    // if(!getOrder){
    //   res.json({
    //     msg:"Failed to create order, please try again",
    //     currentSession:session.id
    //   });
    //   return;
    // }
    
    
    res.json({
      clientSecret:session.client_secret,
      checkoutSessionId:session.id
    });

  }catch (err) {
    res.status(err.status || 500).json({msg: err.message});
  }
}

exports.getSessionStatus = async (req, res) => {
  try {

    const session_id = req.query.session_id;
    const session = await getStripeSession(session_id)
    //Error getting session
    if(!session){
      res.status(400).json({
        msg:`Failed to get session for ${session_id}`
      });
      return;
    }

    res.send({
      status: session.status,
      payment_status: session.payment_status,
      //The return page is the receipt the buyer sees, so it needs the figures and
      //not just the state machine
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email ?? null,
      payment_intent_id: session.payment_intent?.id,
      payment_intent_status: session.payment_intent?.status,
      subscription_id: session.payment_intent ? null : session.subscription?.id,
      subscription_status: session.payment_intent ? null : session.subscription?.status
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: "Failed to get session status"
    })
  }
}
exports.webhook = async(req,res)=>{
  try {
    let event;
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    event = verifySignature(req.body, signature)
    if(!event){
      return res.sendStatus(400);
    }
    console.log(event, event.type);
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break ;
    case 'checkout.session.completed':
      const checkoutCompleted = event.data.object;
      await handleCheckoutComplete(checkoutCompleted);
      break;
    case 'checkout.session.expired':
    const checkoutExpired = event.data.object;
       await handleCheckoutExpired(checkoutExpired.id);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a res to acknowledge receipt of the event
  res.json({received: true})

  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
}