import 'server-only';

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_TEST!, {
  apiVersion: '2023-10-16',
  typescript: true,
  appInfo: {
    name: 'rartEcommerce',
    url: 'https://rart-ecommerce.vercel.app',
  },
});
