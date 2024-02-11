'use client';

import type { StripeError } from '@stripe/stripe-js';

import * as React from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

import * as config from '@/src/app/components/client/checkout/processing/payment/config';
import { createPaymentIntent } from '@/src/app/[locale]/actions/stripe';

import { formatAmountForDisplay } from '../utils/stripeHelper';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { useAuthSelector } from '@/src/app/contexts/auth/hooks/useAuthSelector';
import { UserProfile } from '@/src/types/DBTypes';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';

function CheckoutForm(): JSX.Element | null {
  const { cart } = useCart();
  const authProfile: UserProfile = useAuthSelector((state) => state.profile);

  const [input, setInput] = React.useState<{
    customDonation: number;
    cardholderName: string;
  }>({
    customDonation: Math.round(config.MAX_AMOUNT / config.AMOUNT_STEP),
    cardholderName: '',
  });
  const [paymentType, setPaymentType] = React.useState<string>('');
  const [payment, setPayment] = React.useState<{
    status: 'initial' | 'processing' | 'error';
  }>({ status: 'initial' });
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  const stripe = useStripe();
  const elements = useElements();

  const PaymentStatus = ({ status }: { status: string }) => {
    switch (status) {
      case 'processing':
      case 'requires_payment_method':
      case 'requires_confirmation':
        return <h2>Processing...</h2>;

      case 'requires_action':
        return <h2>Authenticating...</h2>;

      case 'succeeded':
        return <h2>Payment Succeeded 🥳</h2>;

      case 'error':
        return (
          <>
            <h2>Error 😭</h2>
            <p className='error-message'>{errorMessage}</p>
          </>
        );

      default:
        return null;
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput({
      ...input,
      [e.currentTarget.name]: e.currentTarget.value,
    });

    elements?.update({ amount: input.customDonation * 100 });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    try {
      e.preventDefault();
      // Abort if form isn't valid
      if (!e.currentTarget.reportValidity()) return;
      if (!elements || !stripe) return;

      setPayment({ status: 'processing' });

      const { error: submitError } = await elements.submit();

      if (submitError) {
        setPayment({ status: 'error' });
        setErrorMessage(submitError.message ?? 'An unknown error occurred');

        return;
      }

      // Create a PaymentIntent with the specified amount.
      const { client_secret: clientSecret } = await createPaymentIntent(
        new FormData(e.target as HTMLFormElement)
      );

      // Use your card Element with other Stripe.js APIs
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'always',
        confirmParams: {
          return_url: `${window.location.origin}/${ENUM_ROUTES.CHECKOUT_RESULT}`,
          payment_method_data: {
            billing_details: {
              name: input.cardholderName,
            },
          },
        },
      });

      if (confirmError) {
        setPayment({ status: 'error' });
        setErrorMessage(confirmError.message ?? 'An unknown error occurred');
      }
    } catch (err) {
      const { message } = err as StripeError;

      setPayment({ status: 'error' });
      setErrorMessage(message ?? 'An unknown error occurred');
    }
  };

  if (!authProfile) return null;
  if (!cart) return null;

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* <StripeTestCards /> */}
        <fieldset className='elements-style'>
          <legend>Your payment details:</legend>
          {paymentType === 'card' ? (
            <input
              placeholder='Cardholder name'
              className='elements-style'
              type='Text'
              name='cardholderName'
              onChange={handleInputChange}
              required
            />
          ) : null}
          <input type='hidden' name='amount' value={cart.totalPrice} />
          <div className='FormRow elements-style'>
            <PaymentElement
              options={{
                defaultValues: {
                  billingDetails: {
                    name: authProfile.lastname,
                    email: authProfile.email,
                  },
                },
              }}
              onChange={(e) => {
                setPaymentType(e.value.type);
              }}
            />
          </div>
        </fieldset>
        <button
          className='elements-style-background'
          type='submit'
          disabled={
            !['initial', 'succeeded', 'error'].includes(payment.status) ||
            !stripe
          }>
          BUY
        </button>
      </form>
      <PaymentStatus status={payment.status} />
    </>
  );
}

export default CheckoutForm;
