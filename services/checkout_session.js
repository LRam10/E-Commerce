const CheckoutSession = require('../models/Checkout_Sessions');
const DUPLICATE_KEY = 11000;

/*
@Desc  Take the single checkout-session claim for a cart. The unique index on cart_id is
       what enforces "one session per cart"; this decides who won the race. A claim is
       taken with its idempotency key and expiry already set, before Stripe is called, so
       a request that dies mid-call leaves a row the next request can recognise and
       either replay or take over.
@param {string} cartId
@param {string} fingerprint  - hash of the priced line items
@param {string} idempotencyKey - persisted before the Stripe call and reused on every retry
@param {number} expiresAt - unix seconds
@returns {object} {won, claim} - won is true only for the request that may call Stripe fresh
*/
exports.claimCheckoutSession = async (cartId, fingerprint, idempotencyKey, expiresAt) => {
  const now = Math.floor(Date.now() / 1000);
  const claimFields = {
    fingerprint,
    idempotency_key: idempotencyKey,
    expires_at: expiresAt,
    status: 'pending',
    created_at: now
  };

  let claim;
  let won;
  try {
    
    const createCheckoutSession = await CheckoutSession.findOneAndUpdate(
      { cart_id: cartId },
      { $setOnInsert: { cart_id: cartId, ...claimFields } },
      { upsert: true, new: true, includeResultMetadata: true }
    );
    claim = createCheckoutSession.value;
    won = !createCheckoutSession.lastErrorObject?.updatedExisting;
  } catch (error) {
    //Two upserts can both miss and race to insert; the index rejects one of them.
    if (error?.code !== DUPLICATE_KEY) throw error;
    claim = await CheckoutSession.findOne({ cart_id: cartId });
    won = false;
  }
  console.log({won, claim})
  if (won || !claim) return { won, claim };

  //A live claim belongs to someone else - the caller reuses its session.
  const isDead = claim.status === 'expired' || claim.expires_at <= now;
  if (claim.status === 'completed' || !isDead) return { won: false, claim };

  //Dead claim: compare-and-set on the values we read, so only one of several concurrent
  //requests can revive it. The winner changes expires_at, which makes every other
  //filter stop matching.
  const takeover = await CheckoutSession.findOneAndUpdate(
    { _id: claim._id, status: claim.status, expires_at: claim.expires_at },
    { $set: { ...claimFields, stripe_session_id: null, client_secret: null } },
    { new: true }
  );
  if (takeover) return { won: true, claim: takeover };

  return { won: false, claim: await CheckoutSession.findById(claim._id) };
}

/*
@Desc  Write the Stripe ids back onto the claim that produced them. Matching on the
       idempotency key as well as the id means a slow request cannot land its session
       on a claim that has since been taken over by someone else.
*/
exports.updateCheckoutSession = async (claimId, idempotencyKey, stripeSessionId, clientSecret, expiresAt) => {
  return CheckoutSession.findOneAndUpdate(
    { _id: claimId, idempotency_key: idempotencyKey },
    {
      $set: {
        stripe_session_id: stripeSessionId,
        client_secret: clientSecret,
        expires_at: expiresAt
      }
    },
    { new: true }
  );
}

/*
@Desc  Move a claim from one fingerprint to another. The previous fingerprint is part of
       the filter so only one of two concurrent repricings wins the right to call Stripe;
       the loser is told to retry rather than both writing the same session.
@returns {object|null} the updated claim, or null if another request got there first
*/
exports.updateCheckoutFingerprint = async (claimId, previousFingerprint, fingerprint) => {
  return CheckoutSession.findOneAndUpdate(
    { _id: claimId, fingerprint: previousFingerprint },
    { $set: { fingerprint } },
    { new: true }
  );
}

/*
@Desc  Retire the claim for a paid Stripe session, and stamp it for the TTL sweep.
       Deliberately unconditional: this must be a plain idempotent write, never a
       one-shot latch. A filter like status:{$ne:'completed'} would make the first
       delivery consume the claim, so a retry after a partial failure would find nothing
       to do - which turns Stripe's at-least-once delivery into at-most-once execution.
       Re-stamping completed_at on a retry only pushes the sweep out, which is harmless.
@returns {object|null} the claim, or null if no claim carries this session id
*/
exports.completeCheckoutSession = async (stripeSessionId) => {
  return CheckoutSession.findOneAndUpdate(
    { stripe_session_id: stripeSessionId },
    { $set: { status: 'completed', completed_at: new Date() } },
    { new: true }
  );
}

exports.expireCheckoutSession = async (stripeSessionId) => {
  return CheckoutSession.findOneAndUpdate(
    { stripe_session_id: stripeSessionId, status: 'pending' },
    { $set: { status: 'expired' } },
    { new: true }
  );
}
/*
@Desc  Release a completed claim after its delayed payment failed, so the cart can be
       checked out again. This is the one place a completed claim may be reopened, and it
       is only safe because the caller has already won the order's pending -> cancelled
       transition, which proves no payment was ever taken.
@returns {object|null} the claim, or null if it was not completed
*/
exports.releaseCheckoutSession = async (stripeSessionId) => {
  return CheckoutSession.findOneAndUpdate(
    { stripe_session_id: stripeSessionId, status: 'completed' },
    { $set: { status: 'expired' } },
    { new: true }
  );
}

exports.recordReservedItems = async (claimId, idempotencyKey, items) => {
  return CheckoutSession.findOneAndUpdate(
    { _id: claimId, idempotency_key: idempotencyKey },
    { $set: { reserved_items: items } },
    { new: true }
  );
}


exports.expireClaim = async (claimId, idempotencyKey) => {
  return CheckoutSession.findOneAndUpdate(
    { _id: claimId, idempotency_key: idempotencyKey },
    { $set: { status: 'expired' } },
    { new: true }
  );
}

/*
@Desc  Read the claim behind a Stripe session. Used by the return page to decide whether
       completion still needs to run for it.
@returns {object|null}
*/
exports.getClaimByStripeSession = async (stripeSessionId) => {
  return CheckoutSession.findOne({ stripe_session_id: stripeSessionId }).lean();
}
