const { completeCheckoutSession } = require('./checkout_session');
const { markCartConverted } = require('./cart');
const { getStripeSession } = require('./stripe');
const { upsertOrderForSession } = require('./orders');

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

  //Cards settle before this event arrives. Anything else means a payment method was
  //enabled that this flow has not been wired for, so the order is held rather than
  //fulfilled - and said loudly, because the alternative is shipping against no money.
  const paid = session.payment_status === 'paid';
  if (!paid) {
    console.error(
      `[checkout] session ${stripeSessionId} completed with payment_status=${session.payment_status}; order held as pending`
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
  await completeCheckoutSession(stripeSessionId);

  //TODO: decrement item stock
  return order;
}
