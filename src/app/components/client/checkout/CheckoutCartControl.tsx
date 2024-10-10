'use client';

import { useCart } from '@/src/app/contexts/cart/CartContext';
import React from 'react';
import { EmptyCart } from './cart/EmptyCart';
import { CheckoutHeader } from './CheckoutHeader';
import { Page } from '../commons/layout/Page';

interface Props {
  children: React.ReactNode;
}

export const CheckoutCartControl = ({ children }: Props) => {
  const { cart } = useCart();
  if (!cart?.items.length) {
    return (
      <Page>
        <CheckoutHeader />
        <EmptyCart />
      </Page>
    );
  }
  return <>{children}</>;
};
