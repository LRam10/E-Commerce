const Order = require('../models/Order');

const DUPLICATE_KEY = 11000;

/*
@Desc  Map expanded Stripe line items onto order lines. Prices come back as Stripe cents,
       which is what Order.total_cents holds, so nothing is converted on the way in.
@param {array} lineItems - session.line_items.data, expanded to data.price.product
@returns {array} order item subdocuments
*/
const toOrderItems = (lineItems) => lineItems.map((line) => {
  const itemId = line?.price?.product?.metadata?._id;
  if (!itemId) {
    //Almost always a missing 'line_items.data.price.product' expand rather than bad data
    throw new Error('Stripe line item has no catalogue id; check the line_items expand');
  }
  return {
    item_id: itemId,
    quantity: line.quantity,
    price: line.price.unit_amount
  };
});

/*
@Desc  Create the order for a paid Stripe session, once. This is the idempotency fence for
       the whole webhook: the partial unique index on Order
@param {object} order details, keyed rather than positional - the address alone is five
       interchangeable strings and positional args invite a silent 
@returns {object} the order, whether this call created it or found it already there
*/
exports.upsertOrderForSession = async ({
  stripeSessionId,
  email,
  address = {},
  lineItems,
  totalCents,
  paymentType,
  userId,
  guestId,
  status = 'processing'
}) => {
  const fields = {
    email,
    address_street: address.street,
    address_postal: address.postal,
    address_state: address.state,
    address_city: address.city,
    country: address.country,
    items: toOrderItems(lineItems),
    total_cents: totalCents,
    payment_type: paymentType,
    status,
    ...(userId ? { user_id: userId } : {}),
    ...(guestId ? { guest_id: guestId } : {})
  };

  try {
    return await Order.findOneAndUpdate(
      { stripe_session_id: stripeSessionId },
      { $setOnInsert: { stripe_session_id: stripeSessionId, ...fields } },
      { upsert: true, new: true }
    );
  } catch (error) {
    //Two deliveries racing the same upsert: the index rejects one of them, and for this
    //operation a duplicate key means the order exists, which is success rather than failure
    if (error?.code !== DUPLICATE_KEY) throw error;
    return Order.findOne({ stripe_session_id: stripeSessionId });
  }
}
