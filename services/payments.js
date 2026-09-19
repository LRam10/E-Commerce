const {
  completeCheckoutSession,
  releaseCheckoutSession,
  expireCheckoutSession,
  getClaimByStripeSession
} = require('./checkout_session');
const { convertReservation, releaseStock } = require('./items');
const { markCartConverted, reopenCart } = require('./cart');
const { getStripeSession } = require('./stripe');
const { upsertOrderForSession, transitionOrderStatus } = require('./orders');

/*
@Desc  Turn a paid Stripe session into an order, then retire the cart and the claim.
@param {object} paymentOrder - the checkout.session object from the webhook
@returns {object} the order
*/
exports.handleCheckoutComplete = async (paymentOrder) => {
  const stripeSessionId = paymentOrder.id;

  //Always a fresh read: webhook payloads cannot be expanded, and an order must never be
  //built from a cached object
  const session = await getStripeSession(stripeSessionId);
  if (!session) {
    throw new Error(`Stripe session ${stripeSessionId} could not be retrieved`);
  }

  const cartId = session.metadata?.cart_id;
  if (!cartId) {
    throw new Error(`Stripe session ${stripeSessionId} carries no cart_id in metadata`);
  }

  const customerDetails = session.customer_details;
  const address = customerDetails?.address;
  const lineItems = session.line_items?.data ?? [];
  if (!lineItems.length) {
    throw new Error(`Stripe session ${stripeSessionId} returned no line items`);
  }

  //Cards are paid by the time this event arrives. A delayed method is not, and its order
  //waits as pending until async_payment_succeeded or async_payment_failed settles it.
  //Nothing is fulfilled against an unpaid order.
  const paid = session.payment_status === 'paid';
  if (!paid) {
    console.log(
      `[checkout] session ${stripeSessionId} is ${session.payment_status}; order held pending settlement`
    );
  }

  const order = await upsertOrderForSession({
    stripeSessionId,
    email: customerDetails?.email ?? null,
    address: {
      street: address ? `${address.line1 ?? ''} ${address.line2 ?? ''}`.trim() : null,
      postal: address?.postal_code ?? null,
      state: address?.state ?? null,
      city: address?.city ?? null,
      country: address?.country ?? null
    },
    lineItems,
    totalCents: session.amount_total,
    paymentType: session.payment_intent?.latest_charge?.payment_method_details?.card?.brand,
    userId: session.metadata?.user_id,
    guestId: session.metadata?.guest_id,
    status: paid ? 'processing' : 'pending'
  });

  await markCartConverted(cartId);
  const claim = await completeCheckoutSession(stripeSessionId);

  if (paid && claim) await convertReservation(claim._id);
  return order;
}

/*
@Desc  A delayed payment cleared. Runs the full completion sequence first, because this
       event has to stand on its own: checkout.session.completed may still be in flight,
       may have failed, or may have been lost entirely. That sequence is idempotent, so
       running it again costs nothing when it already ran.
@param {object} paymentOrder - the checkout.session object from the webhook
@returns {object} the order, now processing
*/
exports.handleAsyncPaymentSucceeded = async (paymentOrder) => {
  const order = await exports.handleCheckoutComplete(paymentOrder);
  const promoted = await transitionOrderStatus(paymentOrder.id, ['pending'], 'processing');
  return promoted ?? order;
}

/*
@Desc  A delayed payment failed. Cancels the order and gives the basket back.
       The guards are released in the mirror of the order they were taken: the claim
       first, the cart last.
@param {object} paymentOrder - the checkout.session object from the webhook
@returns {object|null} the cancelled order, or null if there was nothing to cancel
*/
exports.handleAsyncPaymentFailed = async (paymentOrder) => {
  const stripeSessionId = paymentOrder.id;

  const cancelled = await transitionOrderStatus(stripeSessionId, ['pending'], 'cancelled');
  if (!cancelled) {
    console.log(`[checkout] async payment failed for ${stripeSessionId} with no pending order to cancel`);
    return null;
  }

  const claim = await releaseCheckoutSession(stripeSessionId);
  if (claim) {
    //Still held, because handleCheckoutComplete does not convert an unpaid session.
    //Stock goes back before the cart does, so a buyer who retries immediately reserves
    //against a count that already includes their own returned units.
    await releaseStock(claim._id);
    await reopenCart(claim.cart_id);
  }
  return cancelled;
}

/*
@Desc  The buyer walked away. Retire the claim and put its stock back. The claim comes
       back only from the call that moved it pending -> expired, which is the at-most-once
       latch for the release; releaseStock is idempotent anyway, so a redelivery that
       somehow gets the claim again still cannot credit twice.
@param {object} paymentOrder - the checkout.session object from the webhook
@returns {object|null} the expired claim, or null if there was nothing pending
*/
exports.handleCheckoutExpired = async (paymentOrder) => {
  const claim = await expireCheckoutSession(paymentOrder.id);
  if (claim) await releaseStock(claim._id);
  return claim;
}


exports.reconcileCheckoutSession = async (session) => {
  if (session?.status !== 'complete') return null;
  const claim = await getClaimByStripeSession(session.id);
  if (claim?.status === 'completed') return null;
  return exports.handleCheckoutComplete(session);
}
