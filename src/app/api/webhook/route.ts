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
import { headers } from 'next/headers';

export async function POST(req: Request) {
  const host = (await headers()).get('host');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const payload = await req.text();
  const signature = (await headers()).get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!signature || !endpointSecret) {
      throw new Error('Missing stripe-signature or endpointSecret');
    }
    event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
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
          const payload = await createInvoice(orderData, data.id, data.receipt_url, true);
          console.log(payload);
          console.log('✅ end create invoice');
          const orderRef = adminDB.collection(ENUM_COLLECTIONS.ORDERS).doc(orderId);
          const invoiceRef = adminDB.collection(ENUM_COLLECTIONS.INVOICES).doc(payload?.invoice?.data._id);
          const mailService = new MailService();
          console.log('Start send email');
          const mailResponse = await mailService.sendEmail({
            files: payload?.pdf ? [payload?.pdf] : [],
            email: orderData.customerInformations.email,
            subject: 'Confirmation de paiement',
            template: {
              name: 'paymentSuccess',
              props: {
                customer: orderData.customerInformations,
                host: process.env.NODE_ENV === 'production' ? `https://${host}` : `http://${host}`,
                contactName: process.env.NEXT_CONTACT_NAME,
                companyName: process.env.NEXT_COMPANY_NAME,
                mailSystem: process.env.NEXT_PUBLIC_MAIL_SYSTEM,
                receiptUrl: data.receipt_url,
              }
            }
          });

          console.log('✅ Email sent');

          invoiceRef.set({
            confirmMailSent: {
              status: true,
              date: new Date().toISOString(),
              messageId: mailResponse.messageId
            },
            invoiceUrl: payload?.pdf?.url ?? null
          }, { merge: true });
          const date = new Date().toISOString();

          orderRef.set({
            invoiceId: payload?.invoice?.data?._id,
            status: 'converted to invoice',
            issueDate: date,
            updatedAt: date,
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
      console.log('ERROR', error.message);
      return NextResponse.json(
        { message: `Webhook handler failed: ${error.message}` },
        { status: 500 },
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: 'Received' }, { status: 200 });
}
