'use client';

import type { StripeError } from '@stripe/stripe-js';

import * as React from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import { isValidContact, reserveStock, rollbackReservations } from './utils';
import { createPaymentIntent } from '@/src/app/[locale]/actions/stripe';
import { useAuthSelector } from '@/src/app/contexts/auth/hooks/useAuthSelector';
import { UserProfile } from '@/src/types/DBTypes';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { useTranslations } from 'next-intl';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import styled from '@emotion/styled';
import PaymentStatus from './PaymentStatus';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/pro-light-svg-icons';
import { useRouter } from 'next/navigation';

const FuckingLaw = styled.span`
  font-size: 12px;
`;

type CustomerType = {
  email: string;
  name: string;
  address: {
    country: string;
    postal_code: string;
    city: string;
    line1: string;
  };
} | null;
function CheckoutForm(): JSX.Element | null {
  const { cart, clearCart } = useCart();
  const authProfile = useAuthSelector((state) => state.profile) as UserProfile;
  const t = useTranslations();
  const router = useRouter();

  const customer: CustomerType = React.useMemo(() => {
    if (!cart?.contactInformations) return null;

    if (!isValidContact(cart.contactInformations)) {
      return null;
    }
    const { email, lastname, firstname, address } = cart.contactInformations;

    if (!address) return null;

    return {
      email,
      name: `${lastname} ${firstname}`,
      address: {
        country: address.country,
        postal_code: address.postalCode,
        city: address.locality,
        line1: address.address,
      },
    };
  }, [cart?.contactInformations]);

  const [input, setInput] = React.useState<string>('');
  const [paymentType, setPaymentType] = React.useState<string>('');
  const [payment, setPayment] = React.useState<{
    status: 'initial' | 'processing' | 'error';
  }>({ status: 'initial' });
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (cart?.contactInformations) {
      setInput(cart.contactInformations.lastname);
    }
  }, [cart?.contactInformations]);

  const stripe = useStripe();
  const elements = useElements();

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.currentTarget.value);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    let globalPreviousValues: any = {};

    try {
      if (!customer || !cart) return;

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

      const newOrderRequestPayload = {
        method: 'POST',
        body: JSON.stringify({ cart, connectedCustomerId: authProfile?._id }),
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const order = await (
        await fetch(ENUM_ROUTES.CREATE_ORDER, newOrderRequestPayload)
      ).json();

      const products =
        cart?.items.filter((item) => item.type === 'product') ?? [];
      const workshops =
        cart?.items.filter((item) => item.type === 'workshop') ?? [];

      const previousValues = await reserveStock(products, workshops, customer);

      globalPreviousValues = previousValues;

      const { client_secret: clientSecret } = await createPaymentIntent(
        new FormData(e.target as HTMLFormElement),
        customer.email,
        order.data
      );

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        redirect: 'always',
        confirmParams: {
          return_url: `${window.location.origin}/${ENUM_ROUTES.CHECKOUT_RESULT}`,
          receipt_email: customer.email,
          expand: ['metadata'],
          payment_method_data: {
            billing_details: {
              name: customer.name,
              email: customer.email,
              address: customer.address,
            },
          },
        },
      });

      if (confirmError) {
        setPayment({ status: 'error' });
        await rollbackReservations(previousValues);
        setErrorMessage(confirmError.message ?? 'An unknown error occurred');
      }
    } catch (err) {
      const { message } = err as StripeError;
      await rollbackReservations(globalPreviousValues);
      setPayment({ status: 'error' });
      setErrorMessage(message ?? 'An unknown error occurred');
    }
  };

  const handleCancel = () => {
    clearCart();
    router.push(ENUM_ROUTES.HOME);
  };

  if (!customer || !cart) {
    return null;
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset>
          {paymentType === 'card' ? (
            <InputGroup
              id='cardholderName'
              name='cardholderName'
              label={t('Cart.cardholderName')}
              onInputChange={handleInputChange}
              value={input}
              required
            />
          ) : null}
          <input type='hidden' name='amount' value={cart.totalPrice} />
          <div>
            <PaymentElement
              options={{
                defaultValues: {
                  billingDetails: {
                    name: customer.name,
                    email: customer.email,
                    address: customer.address,
                  },
                },
              }}
              onChange={(e) => {
                setPaymentType(e.value.type);
              }}
            />
          </div>
        </fieldset>
        <Flexbox
          style={{
            marginTop: '20px',
          }}>
          <Button
            type='submit'
            style={{
              width: '100%',
              justifyContent: 'center',
              flexDirection: 'column',
              fontSize: '20px',
            }}
            disabled={
              !['initial', 'succeeded', 'error'].includes(payment.status) ||
              !stripe
            }>
            <Flexbox>
              <span>{t('Cart.pay')}</span>
              <FontAwesomeIcon icon={faLock} style={{ marginLeft: '10px' }} />
            </Flexbox>
            <FuckingLaw>{t('Cart.orderPaymentMandatory')}</FuckingLaw>
          </Button>
        </Flexbox>
      </form>

      <PaymentStatus
        paymentStatus={payment.status}
        errorMessage={errorMessage}
        onRetry={() => setPayment({ status: 'initial' })}
        onCancel={handleCancel}
        open={!['initial'].includes(payment.status)}
      />
    </>
  );
}

export default CheckoutForm;
