'use client';

import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import * as config from '@/src/app/components/client/checkout/payment/config';
import getStripe from './utils/getStripeLoader';
import CheckoutForm from './components/CheckoutForm';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import CartSummary from '../commons/CartSummary';
import styled from '@emotion/styled';
import { Section } from '../../commons/layout/Section';
import { CheckoutHeader } from '../CheckoutHeader';
import { Page } from '../../commons/layout/Page';

const CustomSection = styled(Section)`
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const CardWrapper = styled.aside`
  label: PaymentWrapper;
  min-width: 50%;
`;

const PaymentIndex = () => {
  const { cart } = useCart();

  if (!cart?.totalPrice) return null;

  return (
    <Page>
      <CheckoutHeader />
      <CustomSection>
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
        <CartSummary editable={false} />
      </CustomSection>
    </Page>
  );
};

export default PaymentIndex;
