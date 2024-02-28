'use client';

import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import * as config from '@/src/app/components/client/checkout/processing/payment/config';
import getStripe from './utils/getStripeLoader';
import CheckoutForm from './components/CheckoutForm';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import CartSummary from '../commons/CartSummary';
import styled from '@emotion/styled';
import { Section } from '../../../commons/layout/Section';

const CustomSection = styled(Section)`
  flex-direction: row;
`;

const CardWrapper = styled.aside`
  label: PaymentWrapper;
  min-width: 50%;
`;

const PaymentIndex = () => {
  const { cart } = useCart();

  if (!cart?.totalPrice) return null;

  return (
    <CustomSection>
      <Flexbox flexDirection='column'>
        <CartSummary editable={false} />
      </Flexbox>
      <CardWrapper>
        <Elements
          stripe={getStripe()}
          options={{
            appearance: {
              variables: {
                colorIcon: '#6772e5',
                fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
              },
            },
            loader: 'always',
            currency: config.CURRENCY,
            mode: 'payment',
            amount: cart.totalPrice,
          }}>
          <CheckoutForm />
        </Elements>
      </CardWrapper>
    </CustomSection>
  );
};

export default PaymentIndex;
