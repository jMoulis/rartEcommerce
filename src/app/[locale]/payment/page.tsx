import type { Stripe } from 'stripe';
import { stripe } from '@/src/lib/stripe/stripe';
import Result from '@/src/app/components/client/checkout/result/Result';

const load = async (searchParams: any) => {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(searchParams.payment_intent);
  return {
    paymentIntent,
  };
};
export default async function PaymentPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}): Promise<JSX.Element> {
  if (!searchParams.payment_intent) {
    throw new Error('Please provide a valid payment_intent (`pi_...`)');
  }

  const { paymentIntent } = await load(searchParams);

  return <Result paymentStatus={paymentIntent.status === 'succeeded'} />;
}
