import Stripe from 'stripe';

const key = process.env.NODE_ENV === 'development' ? `${process.env.STRIPE_SECRET_KEY_TEST}` : `${process.env.STRIPE_SECRET_KEY_PROD}`;

export const stripe = new Stripe(key, {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'rartEcommerce',
    url: 'https://rart-ecommerce.vercel.app',
  },
});
