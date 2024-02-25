/* eslint-disable no-console */
import type { Stripe } from 'stripe';
import { NextResponse } from 'next/server';
import { stripe } from '@/src/lib/stripe/stripe';
import { createInvoice } from '../invoices/utils';
import { getAdminDocument } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { adminDB } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { MailService } from '@/src/lib/mailService/MailService';
import { IOrder } from '@/src/types/DBTypes';

export async function POST(req: Request) {
  const host = req.headers.get('host');
  let event: Stripe.Event;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature');
  try {
    event = stripe.webhooks.constructEvent(payload, signature!, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    // On error, log and return the error message.
    if (err instanceof Error) console.info(err);
    console.info(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 },
    );
  }

  // Successfully constructed event.
  console.info('✅ Success:', event.id);
  // console.info(JSON.parse(payload)?.data);
  const permittedEvents: string[] = [
    'charge.succeeded',
    'checkout.session.completed',
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
  ];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case 'charge.succeeded': {
          data = event.data.object;
          const { orderId } = data.metadata;
          console.log('✅ ChargeSucced');
          if (!orderId) {
            throw Error('No orderId');
          }
          console.log('Start get order', orderId);
          const orderData = (await getAdminDocument(orderId, ENUM_COLLECTIONS.ORDERS)).data as IOrder;
          console.log('✅ Get order done');
          console.log('Start create invoice');
          const payload = await createInvoice(orderData, data.id, data.receipt_url) as unknown as {
            data: {
              _id: string
            }
          };
          console.log('✅ end create invoice');
          const orderRef = adminDB.collection(ENUM_COLLECTIONS.ORDERS).doc(orderId);
          const invoiceRef = adminDB.collection(ENUM_COLLECTIONS.INVOICES).doc(payload.data._id);
          const mailService = new MailService();
          console.log('Start send email');
          await mailService.sendEmail({
            email: orderData.customerInformations.email,
            subject: 'Confirmation de paiement',
            template: {
              name: 'paymentSuccess',
              props: {
                customer: orderData.customerInformations,
                host: process.env.NODE_ENV === 'production' ? `https://${host}` : `http://${host}`,
              }
            }
          });
          console.log('✅ Email sent');

          invoiceRef.set({
            confirmMailSent: {
              status: true,
              date: new Date().toISOString()
            }
          }, { merge: true });
          const date = new Date().toISOString();

          orderRef.set({
            invoiceId: payload?.data?._id,
            status: 'converted to invoice',
            issueDate: date,
            updatedAt: date
          }, {
            merge: true
          });

          break;
        }
        case 'checkout.session.completed':
          data = event.data.object;
          console.info(`💰 CheckoutSession status: ${data.payment_status}`);
          break;
        case 'payment_intent.payment_failed':
          data = event.data.object;
          console.info(`❌ Payment failed: ${data.last_payment_error?.message}`);
          break;
        case 'payment_intent.succeeded': {
          data = event.data.object;
          console.info(`💰 PaymentIntent status: ${data.status}`);
          break;
        }
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error: any) {
      return NextResponse.json(
        { message: `Webhook handler failed: ${error.message}` },
        { status: 500 },
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
