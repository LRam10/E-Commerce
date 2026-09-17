const { validationResult} = require('express-validator');

const { createStripeSession , getStripeSession, verifySignature } = require('../services/stripe');

const {
  handleCheckoutComplete,
  handleAsyncPaymentSucceeded,
  handleAsyncPaymentFailed
} = require('../services/payments');
const { handleCheckoutExpired } = require('../services/checkout_session');

const { getCart } = require('../services/cart');
const { checkStockAvailability,replenishItems } = require('../services/items')
const { getOrderByStripeSession } = require('../services/orders')
exports.createSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { cartId } = req.body;
    //Ownership is part of the lookup, so a cart that is not the caller's reads as missing
    const owner = req?.user?.id ? {userId: req.user.id} : {guestId: req?.guestId};
    //Get user cart
    const cart = await getCart(cartId, owner);
    //Check inventory
    if(!cart || !cart.items || cart.items.length === 0){
      res.status(400).json({
        msg:'Cart is empty or does not exist'
      });
      return;
    }
    //Check stock availability
    const isStockAvailable = await checkStockAvailability(cart.items);
    if(!isStockAvailable){
      res.status(409).json({
        msg:'Some items are no longer available in the quantity requested'
      });
      return;
    }
    const session = await createStripeSession(cart);
    if(!session){
      res.json({
        msg:'Failed to create session, please try again'
      });
      return;
    }
    
    
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
  switch (event.type) {
    case 'checkout.session.async_payment_succeeded':
      const asyncPaid = event.data.object;
      await handleAsyncPaymentSucceeded(asyncPaid);
      break;
    case 'checkout.session.async_payment_failed':
      const asyncFailed = event.data.object;
      await handleAsyncPaymentFailed(asyncFailed);
      break ;
    case 'checkout.session.completed':
      const checkoutCompleted = event.data.object;
      await handleCheckoutComplete(checkoutCompleted);
      break;
    case 'checkout.session.expired':
    const checkoutExpired = event.data.object;
      const expiredResult =  await handleCheckoutExpired(checkoutExpired.id);
      //Check this is the first time expireResult is set
      if(expiredResult.modifiedCount === 1){
        //Get order by session
        const getOrderResult = await getOrderByStripeSession(checkoutExpired.id);
        //Put order qty back to stock
        const items = getOrderResult.items;
        await replenishItems(items);
      }
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