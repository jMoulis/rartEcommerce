'use server';

import type { Stripe } from 'stripe';
import { CURRENCY } from '@/src/app/components/client/checkout/payment/config';
import { formatAmountForStripe } from '@/src/app/components/client/checkout/payment/utils/stripeHelper';
import { stripe } from '@/src/lib/stripe/stripe';

export async function createPaymentIntent(
  amount: number,
  email: string,
  orderId?: string,
): Promise<{ client_secret: string, paymentId: string }> {
  const key = process.env.NODE_ENV === 'development' ? `${process.env.STRIPE_SECRET_KEY_TEST}` : `${process.env.STRIPE_SECRET_KEY_PROD}`;
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(amount),
        CURRENCY,
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
      receipt_email: email,
      metadata: {
        orderId: orderId ?? null,
      }
    }, {
      apiKey: key
    });

  return { client_secret: paymentIntent.client_secret!, paymentId: paymentIntent.id };
}
