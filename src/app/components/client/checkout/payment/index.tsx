'use client';

import * as React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from './utils/getStripeLoader';
import CheckoutForm from './components/CheckoutForm';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import CartSummary from '../commons/CartSummary';
import styled from '@emotion/styled';
import { Section } from '../../commons/layout/Section';
import { CheckoutHeader } from '../CheckoutHeader';
import { Page } from '../../commons/layout/Page';
import { createPaymentIntent } from '@/src/app/[locale]/actions/stripe';

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

const stripePromise = getStripe();

const PaymentIndex = () => {
  const { cart } = useCart();
  const [clientSecret, setClientSecret] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!cart?.totalPrice) return;
    const customerEmail = cart.contactInformations?.email;
    // Create PaymentIntent as soon as the page loads
    createPaymentIntent(cart.totalPrice, customerEmail).then((data) => {
      setClientSecret(data.client_secret);
    });
  }, []);

  if (!cart?.totalPrice) return null;

  return (
    <Page>
      <CheckoutHeader />
      <CustomSection>
        <CardWrapper>
          {clientSecret ? (
            <Elements
              stripe={stripePromise}
              options={{
                appearance: {
                  variables: {
                    colorIcon: '#6772e5',
                    fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                  },
                },
                clientSecret,
                loader: 'always',
              }}>
              <CheckoutForm />
            </Elements>
          ) : null}
        </CardWrapper>
        <CartSummary editable={false} />
      </CustomSection>
    </Page>
  );
};

export default PaymentIndex;

// TypeError: Cannot read properties of undefined (reading 'dispatch')
