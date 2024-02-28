'use client';

import { useCart } from '@/src/app/contexts/cart/CartContext';
import React from 'react';
import { Section } from '../commons/layout/Section';
import { EmptyCart } from './processing/cart/EmptyCart';

interface Props {
  children: React.ReactNode;
}

export const CheckoutCartControl = ({ children }: Props) => {
  const { cart } = useCart();
  if (!cart?.items.length) {
    return (
      <Section>
        <EmptyCart />
      </Section>
    );
  }
  return <>{children}</>;
};
