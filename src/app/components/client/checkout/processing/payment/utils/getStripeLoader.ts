import { Stripe, loadStripe, } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

const getStripeLoader = async () => {
  const key = process.env.NODE_ENV === 'development' ? `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_TEST}` : `${process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY_PROD}`;
  if (!stripePromise) {
    stripePromise = loadStripe(`${key}`);
  }
  return stripePromise;
};

export default getStripeLoader;
