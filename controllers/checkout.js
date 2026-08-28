const { validationResult} = require('express-validator');

const { createCheckoutSession } = require('../services/stripe');
const { createOrderDb }= require('../services/orders'); 
exports.createSession = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { items, checkout_session_key } = req.body;

    const session = await createCheckoutSession(items, checkout_session_key);
    console.log({
      session
    })
    if(!session){
      res.json({
        error:'Failed to create session, please try again'
      });
      return;
    }
    const totalAmount = session?.amount_total;
    const getOrder = await createOrderDb(session.id, items, 'pending', totalAmount);
    if(!getOrder){
      res.json({
        error:"Failed to create order, please try again",
        currentSession:session.id
      });
      return;
    }
    
    
    res.json({
      clientSecret:session.client_secret,
      checkoutSessionId:session.id
    });

  }catch (err) {
    res.status(err.status || 500).json({error: err.message});
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
