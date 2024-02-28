import type { Stripe } from 'stripe';
import { stripe } from '@/src/lib/stripe/stripe';
import { getAdminDocument } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IInvoiceInput, IOrder } from '@/src/types/DBTypes';
import Result from '@/src/app/components/client/checkout/result/Result';

const load = async (searchParams: any) => {
  const paymentIntent: Stripe.PaymentIntent =
    await stripe.paymentIntents.retrieve(searchParams.payment_intent);

  const order = (
    await getAdminDocument(
      paymentIntent.metadata.orderId,
      ENUM_COLLECTIONS.ORDERS
    )
  ).data as IOrder;
  let invoice: IInvoiceInput | null = null;

  if (order?.invoiceId) {
    invoice = (
      await getAdminDocument(order.invoiceId, ENUM_COLLECTIONS.INVOICES)
    ).data as IInvoiceInput;
  }
  return {
    invoice,
    paymentIntent,
  };
};
export default async function ResultPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}): Promise<JSX.Element> {
  if (!searchParams.payment_intent) {
    throw new Error('Please provide a valid payment_intent (`pi_...`)');
  }

  const { invoice, paymentIntent } = await load(searchParams);

  return (
    <Result
      invoice={invoice}
      paymentStatus={paymentIntent.status === 'succeeded'}
    />
  );
}
