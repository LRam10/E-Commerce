import { loadStripe } from '@stripe/stripe-js';

//Stripe.js must be loaded exactly once for the lifetime of the tab. Keeping the
//promise at module scope means no component ever has to memoize it.
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const checkoutAppearance = {
  theme:'stripe',
};
