'use server';

import type { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { CURRENCY } from '@/src/app/components/client/checkout/processing/payment/config';
import { formatAmountForStripe } from '@/src/app/components/client/checkout/processing/payment/utils/stripeHelper';
import { stripe } from '@/src/lib/stripe/stripe';

export async function createCheckoutSession(
  data: FormData,
): Promise<{ clientSecretSession: string | null; url: string | null }> {
  const uiMode = data.get(
    'uiMode',
  ) as Stripe.Checkout.SessionCreateParams.UiMode;

  const origin: string = headers().get('origin')!;

  const checkoutSession: Stripe.Checkout.Session =
    await stripe.checkout.sessions.create({
      mode: 'payment',
      submit_type: 'donate',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: CURRENCY,
            product_data: {
              name: 'Custom amount donation',
            },
            unit_amount: formatAmountForStripe(
              Number(data.get('amount') as string),
              CURRENCY,
            ),
          },
        },
      ],
      ...(uiMode === 'hosted' && {
        success_url: `${origin}/checkout/payment/result?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/payment`,
      }),
      ...(uiMode === 'embedded' && {
        return_url: `${origin}/checkout/payment/result?session_id={CHECKOUT_SESSION_ID}`,
      }),
      ui_mode: uiMode,
    });

  return {
    clientSecretSession: checkoutSession.client_secret,
    url: checkoutSession.url,
  };
}

export async function createPaymentIntent(
  data: FormData,
): Promise<{ client_secret: string }> {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.create({
      amount: formatAmountForStripe(
        Number(data.get('amount') as string),
        CURRENCY,
      ),
      automatic_payment_methods: { enabled: true },
      currency: CURRENCY,
    }, {
      apiKey: `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY_TEST}`
    });

  return { client_secret: paymentIntent.client_secret! };
}
