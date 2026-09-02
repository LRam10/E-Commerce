const stripe = require('stripe')(process.env.TEST_STRIPE_SECRET_KEY);
const uuid = require('uuid');
//Webokk secrete
const SHARED_STRIPE_SECRET = process.env.STRIPE_SHARED_SECRET;
const APP_URL = process.env.APP_URL;
const { createCheckoutSession,
  getCheckoutSession,
  updateCheckoutSession,
  updateCheckoutFingerprint,
  deleteCheckoutSession
} = require('./checkout_session');
//Services
const { buildLineItems, createHashItems } = require('./items');
/*
@Docs
//@Desc   Create a new stripe session for a user with an indempotency 
// key to prevent duplicate sessions
//@param {string}   sessionId - Object containing session details
//@param {array} items - Array of items to be purchased, each with item_id and quantity
//@returns {object} - Returns an object containing the client secret and checkout session ID
*/ 
const CHECKOUT_SESSION_TTLS = 60 * 30;
exports.createStripeSession = async (cart) => {
  try {
    const items = cart?.items;
    const lineItems = await buildLineItems(items);
    if(!lineItems){
      throw new Error('Failed to create line items');
    }
    //hashitems 
    const fingerprint = createHashItems(items);
    //Check if a session already exists for this cart and hash, with pending status
    const claimCheckout = await createCheckoutSession(cart._id, fingerprint);

    if(claimCheckout) {
      const userId = cart?.user_id ?? cart?.guest_id;
      const idempotencyKey = uuid.v4();
      const key = `${userId}:checkout:${idempotencyKey}`;
      const expiresAt = Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_TTLS
      const session = await stripe.checkout.sessions.create({
        ui_mode: "elements",
        line_items:lineItems,
        mode: 'payment',
        //ui_mode elements rejects success_url. Redirect-based methods come back here
        //and the page reads the outcome from get-session-status
        return_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
          checkoutSessionId: claimCheckout._id.toString(),
        },
        automatic_tax: {
          enabled: true
        },
        expires_at: expiresAt
        //Replaying the same cart returns the session already created for it rather
        //than opening another one
      }, { idempotencyKey: key });

      //Update the checkout session with the stripe session id and client secret
      const stripeSessionId = session.id;
      const clientSecret = session.client_secret;
      const expires_at = session.expires_at;
      const checkoutUpdate = await updateCheckoutSession(
        cart._id, stripeSessionId,
        clientSecret,
        expires_at,
        key
      );

      if (!checkoutUpdate) {
        throw new Error('Failed to update checkout session');
      }
      return {
        id: session.id,
        client_secret: session.client_secret,
      }
    }
    //get existing seession for this cart

    const existingSession = await getCheckoutSession(cart._id);
    if(!existingSession) throw new Error('Failed to get existing checkout session');
    //Request for secret key has not compeleted yet,
    if(!existingSession.secret_key) throw new Error('Checkout session is still being processed, please try again');

    if( existingSession.status !== 'pending' && existingSession.expires_at < Math.floor(Date.now() / 1000)) {
      await deleteCheckoutSession(cart._id);
      return createStripeSession(cart);
    }

    //Cart items have changed
    if(existingSession.fingerprint !== fingerprint) {
      await stripe.checkout.sessions.update(existingSession.stripe_session_id, {
        line_items:lineItems ,
      });
      //Update the fingerprint in the checkout session
      const updatedSession = await updateCheckoutFingerprint(
        cart._id,
        fingerprint,
      )
    }
    return {
      id: existingSession.stripe_session_id,
      client_secret: existingSession.secret_key,
    }
    


  } catch (error) {
    console.log(error)
    return null
  }
}

exports.getStripeSession = async(sessionId)=>{
  try {
    return stripe.checkout.sessions.retrieve(sessionId, {expand: ["payment_intent", "subscription"]});
  } catch (error) {
    console.log('Failed to get session id')
    return null;
  }
}

exports.verifySignature = (eventBody, signature)=>{
    try {
      return stripe.webhooks.constructEvent(
        eventBody,
        signature,
        SHARED_STRIPE_SECRET
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`, err.message);
      return null
    }
}