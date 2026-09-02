const CheckoutSession = require('../models/Checkout_Sessions');

exports.getCheckoutSession = async (cartId, hashItems) => {
  try {
    const session = await CheckoutSession.findOne({
      cart_id: cartId,
    });
     return session;
  } catch (error) {
    console.error('Error fetching pending checkout session:', error);
    return null;
  }
}

exports.createCheckoutSession = async (cartId, hashItems) => {
  try {
    const newSession = new CheckoutSession({
      cart_id: cartId,
      fingerprint: hashItems,
      status: 'pending',
      created_at: Math.floor(Date.now() / 1000)
    });
    await newSession.save();
    return newSession;
  }catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(error);
  }
}

exports.updateCheckoutSession = async (cartId, stripeSessionId, clientSecret, expiresAt, idempotencyKey) => {
  try {
    const updatedSession = await CheckoutSession.findOneAndUpdate(
      { cart_id: cartId },
      {
        stripe_session_id: stripeSessionId,
        client_secret: clientSecret,
        expires_at: expiresAt,
        idempotency_key: idempotencyKey
      },
      { new: true }
    );
    return updatedSession;
  } catch (error) {
    console.error('Error updating checkout session:', error);
    throw new Error('Failed to update checkout session');
  }
}
exports.deleteCheckoutSession = async (cartId) => {
  try {
    const deletedSession = await CheckoutSession.findOneAndDelete({ cart_id: cartId });
    return deletedSession;
  } catch (error) {
    console.error('Error deleting checkout session:', error);
    throw new Error('Failed to delete checkout session');
  }
}

exports.updateCheckoutFingerprint = async (cartId, fingerprint) => {
  try {
    const updatedSession = await CheckoutSession.findOneAndUpdate(
      { cart_id: cartId },
      { fingerprint: fingerprint },
      { new: true }
    );
    return updatedSession;
  } catch (error) {
    console.error('Error updating checkout session fingerprint:', error);
    throw new Error('Failed to update checkout session fingerprint');
  }
}

exports.handleCheckoutExpired = async (stripeSessionId) => {
  try {
    const session = await CheckoutSession.findOneAndUpdate(
      { stripe_session_id: stripeSessionId },
      { status: 'expired' },
      { new: true }
    );
    return session;
  } catch (error) {
    console.error('Error updating checkout session status to expired:', error);
    throw new Error('Failed to update checkout session status');
  }
}