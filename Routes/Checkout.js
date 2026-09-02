const express = require('express');
const router = express.Router();

const checkout = require('../controllers/checkout');
const optionalAuth = require('../middleware/optionalAuth');
const rateLimited = require('../middleware/rateLimiter');
const { check, query } = require('express-validator');
const rateLimiter = require('../middleware/rateLimiter');

//New create checkout session
//Prices are looked up from the catalogue in the service, so the body only has
//to name the items. The closing bracket used to land before
//checkout_session_key, which left that check dangling outside the chain
router.post('/create-checkout-session', [
    optionalAuth,
    rateLimited,
    check('cartId').not().isEmpty().withMessage('cartId is required')],
    checkout.createSession);
//Get checkout session status
router.get('/get-session-status', [query('session_id').not().isEmpty()], checkout.getSessionStatus);

module.exports = router;