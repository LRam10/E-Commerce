//Libs
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const uuid = require('uuid');

//Storare

const redisClient = require('../config/redis');
//Services
const {
   buildLineItems,
   createHashItems,
   reserveStock, 
   releaseStock 
   } = require('./items');
const { 
  claimCheckoutSession,
  updateCheckoutSession,
  updateCheckoutFingerprint,
  recordReservedItems,
  expireClaim
} = require('./checkout_session');

const CHECKOUT_SESSION_TTLS = 60 * 31;
const APP_URL = process.env.APP_URL;
//Webhook signing secret
const SHARED_STRIPE_SECRET = process.env.STRIPE_SHARED_SECRET;
//Missing config surfaces here, at boot, rather than as a signature failure on the first
//webhook - which looks like a Stripe problem and leaves every paid session unfulfilled
//until someone reads the logs.
for (const [name, value] of Object.entries({ APP_URL, STRIPE_SHARED_SECRET: SHARED_STRIPE_SECRET })) {
  if (!value) throw new Error(`${name} is not set; refusing to start without it`);
}

/*
@Desc   Turn a won claim into a Stripe Checkout Session. Called with the key already
        persisted on the claim, so if this request died last time and is being retried,
        Stripe replays the session it already made instead of opening a second one.
@param  {object} cart - carried only for the owner, which is stamped into metadata
@param  {object} claim - the claim row this request owns
@param  {array}  lineItems
@returns {object} {id, client_secret}
*/
const materializeStripeSession = async (cart, claim, lineItems) => {
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      ui_mode: "elements",
      line_items: lineItems,
      mode: 'payment',
      payment_method_types:['card'],
      //ui_mode elements rejects success_url. Redirect-based methods come back here
      //and the page reads the outcome from get-session-status
      return_url: `${APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      //Read back by the webhook. Keeping the cart and its owner here means order
      //creation never has to resolve them through the claim, which by then may have
      //expired and been taken over by a later checkout.
      metadata: {
        cart_id: claim.cart_id.toString(),
        ...(cart?.user_id ? {user_id: String(cart.user_id)} : {}),
        ...(cart?.guest_id ? {guest_id: String(cart.guest_id)} : {}),
      },
      automatic_tax: {
        enabled: true
      },
      expires_at: claim.expires_at
      //Replaying the same key returns the session already created for it rather
      //than opening another one
    }, { idempotencyKey: claim.idempotency_key });
  } catch (error) {
    //Stripe rejects a key that is still in flight on another request. That request is
    //about to produce the session, so the caller should retry rather than make its own.
    if (error?.type === 'StripeIdempotencyError') {
      throw Object.assign(
        new Error('Checkout session is still being created, please try again'),
        { status: 409 }
      );
    }
    //Stripe records the response for a key - success or refusal - and replays it on
    //every later use. A request that reached Stripe and was refused has burned this
    //claim's key: leave the claim and every retry replays the refusal until takeover.
    //Tear it down so the next request claims afresh. A connection error carries no
    //statusCode, and is the one case where nothing was recorded and a replay can work.
    if (error?.statusCode) await abandonClaim(claim);
    throw error;
  }

  const checkoutUpdate = await updateCheckoutSession(
    claim._id,
    claim.idempotency_key,
    session.id,
    session.client_secret,
    session.expires_at
  );
  if (!checkoutUpdate) {
    //The claim was taken over while Stripe was answering. This session is orphaned
    //rather than duplicated - it is never handed to a buyer and expires on its own.
    throw Object.assign(
      new Error('Checkout session was reset, please try again'),
      { status: 409 }
    );
  }
  
  return {
    id: session.id,
    client_secret: session.client_secret,
  };
}

/*
@Docs
//@Desc   Get the one Stripe session for this cart, creating it only if this request is
//        the one that won the claim. Concurrent requests for the same cart converge on
//        a single session instead of each opening one.
//@param {object} cart
//@returns {object} - Returns an object containing the client secret and checkout session ID
*/
exports.createStripeSession = async (cart) => {

  const lineItems = await buildLineItems(cart?.items);
  const currentFingerPrint = createHashItems(lineItems);

  const expiresAt = Math.floor(Date.now() / 1000) + CHECKOUT_SESSION_TTLS;
  //Generated once per claim and persisted before Stripe is called
  const idempotencyKey = `checkout:${cart._id}:${uuid.v4()}`;

  const { won, claim } = await claimCheckoutSession(cart._id, currentFingerPrint, idempotencyKey, expiresAt);
  if (!claim) throw new Error('Failed to claim checkout session');

  if (claim.status === 'completed') {
    throw Object.assign(new Error('This cart has already been paid for'), { status: 409 });
  }

  //Either we won, or we lost to a request that died before Stripe answered. Both replay
  //the claim's key, so both end up pointing at the same Stripe session.
  if (won || !claim.stripe_session_id) {
    if (won) await releaseStock(claim._id);
    await holdStock(claim, cart);
    return materializeStripeSession(cart, claim, lineItems);
  }

  if (claim.fingerprint !== currentFingerPrint) {
    //Win the right to reprice before touching stock or Stripe
    const repriced = await updateCheckoutFingerprint(claim._id, claim.fingerprint, currentFingerPrint);
    if (!repriced) {
      throw Object.assign(
        new Error('Checkout session is being updated, please try again'),
        { status: 409 }
      );
    }
    //The held lines are the old cart. Swap them for the new one
    await releaseStock(claim._id);
    await holdStock(claim, cart);
    try {
      await stripe.checkout.sessions.update(claim.stripe_session_id, {
        line_items: lineItems,
      });
    } catch (error) {
      //Stock now holds the new lines while Stripe still holds the old ones. Restoring
      //the fingerprint alone would leave those disagreeing, so the claim goes instead.
      await abandonClaim(claim);
      throw error;
    }
  }

  return {
    id: claim.stripe_session_id,
    client_secret: claim.client_secret,
  }
}

const abandonClaim = async (claim) => {
  if (claim.stripe_session_id) {
    try {
      await stripe.checkout.sessions.expire(claim.stripe_session_id);
    } catch (error) {
      console.log(`[checkout] could not expire Stripe session ${claim.stripe_session_id}:`, error?.message);
    }
  }
  await expireClaim(claim._id, claim.idempotency_key);
  await releaseStock(claim._id);
}

const holdStock = async (claim, cart) => {
  const reserved = await reserveStock(claim._id, cart.items);
  if (!reserved.ok) {
    await abandonClaim(claim);
    throw Object.assign(
      new Error('Some items are no longer available in the quantity requested'),
      { status: 409, unavailable: reserved.unavailable }
    );
  }
  await recordReservedItems(claim._id, claim.idempotency_key, cart.items);
}

//line_items expansion returns 100 entries by default. Cart validation caps a cart at 50
//lines, so this is covered - raising that cap means paginating here.
const SESSION_EXPAND = ['line_items.data.price.product', 'payment_intent.latest_charge'];
const SESSION_CACHE_SECONDS = 24 * 60 * 60;

/*
@Desc   Retrieve a Checkout Session with the line items and the charge expanded. Webhook
        payloads arrive with fixed expansion, so this is the only way to reach either.
@param  {string} sessionId
@param  {boolean} fromCache - read path only. Order creation must always call with false:
        the cache is an optimisation for the receipt page, and an order built from a stale
        object is a wrong record that is hard to correct afterwards.
@returns {object|null} the session, or null if Stripe could not be reached
*/
exports.getStripeSession = async (sessionId, fromCache = false) => {
  const key = `stripe:session:${sessionId}`;
  if (fromCache) {
    const cached = await redisClient.get(key);
    if (cached) return typeof cached === 'string' ? JSON.parse(cached) : cached;
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: SESSION_EXPAND });
    //Only a terminal session may be cached. The success page polls this endpoint to watch
    //payment_status change, so caching an open session would stop the poll ever settling
    //and would tell a buyer who has paid that nothing happened.
    if (session?.status === 'complete' || session?.status === 'expired') {
      await redisClient.setex(key, SESSION_CACHE_SECONDS, JSON.stringify(session));
    }
    return session;
  } catch (error) {
    console.log(`Failed to retrieve Stripe session ${sessionId}:`, error?.message);
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
