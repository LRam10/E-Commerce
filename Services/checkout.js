const stripe = require('stripe')(process.env.TEST_STRIPE_SECRET_KEY);
const { validationResult} = require('express-validator');
exports.createSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { items, checkout_session_key } = req.body;
    //TODO: Make sure the checkout_session_key is unique and not used before to prevent duplicate sessions
    const session = await stripe.checkout.sessions.create({
      ui_mode:"elements",
      line_items:items,
      mode:'payment',
      success_url:`${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      metadata:{
        checkout_session_key
      },
      automatic_tax:{
        enabled:true
      }
    })
    res.json({
      clientSecret:session.client_secret,
      checkoutSessionId:session.id
    });

  }catch (err) {  
    res.status(500).json({error: err.message});
  }
}

exports.getSessionStatus = async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id, {expand: ["payment_intent", "subscription"]});

   res.send({
    status: session.status,
    payment_status: session.payment_status,
    payment_intent_id: session.payment_intent?.id,
    payment_intent_status: session.payment_intent?.status,
    subscription_id: session.payment_intent ? null : session.subscription?.id,
    subscription_status: session.payment_intent ? null : session.subscription?.status
  });
}