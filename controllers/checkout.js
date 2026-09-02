const { validationResult} = require('express-validator');

const { createStripeSession , getStripeSession, verifySignature } = require('../services/stripe');

const { handleCheckoutComplete } = require('../services/payments');
const { handleCheckoutExpired } = require('../services/checkout_session');

const { getCart } = require('../services/cart');
exports.createSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cartId } = req.body;
    //Ownership is part of the lookup, so a cart that is not the caller's reads as missing
    const owner = req?.user?.id ? {userId: req.user.id} : {guestId: req?.guestId};
    const cart = await getCart(cartId, owner);
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
    const session = await getStripeSession(session_id, true)
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
  let event;
  try {
    // Get the signature sent by Stripe
    const signature = req.headers['stripe-signature'];
    event = verifySignature(req.body, signature)
    if(!event){
      //The only genuinely malformed case, and the only one Stripe should not resend
      return res.sendStatus(400);
    }
    //The event object carries customer name, email and billing address - log the id only
    console.log(`Stripe event ${event.id} ${event.type}`);
  switch (event.type) {
    case 'checkout.session.async_payment_succeeded':
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'checkout.session.async_payment_failed':
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
    //Stripe retries any non-2xx, but a 400 tells whoever reads the dashboard the payload
    //was malformed and sends them hunting for a signature problem instead of this one
    console.error(`Webhook handler failed for event ${event?.id} (${event?.type})`, error);
    return res.sendStatus(500);
  }
}