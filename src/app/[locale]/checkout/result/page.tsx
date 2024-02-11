import type { Stripe } from 'stripe';
import { stripe } from '@/src/lib/stripe/stripe';
import { redirect } from 'next/navigation';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}): Promise<JSX.Element> {
  if (!searchParams.payment_intent) {
    throw new Error('Please provide a valid payment_intent (`pi_...`)');
  }

  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  if (paymentIntent.status === 'succeeded') {
    redirect(`${ENUM_ROUTES.CHECKOUT_SUCCESS}`);
  }

  return <></>;
}
