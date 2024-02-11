'use client';

import { useCart } from '@/src/app/contexts/cart/CartContext';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import Cart from './processing/cart/Cart';
import Link from 'next/link';
import { Section } from '../commons/layout/Section';

export const Checkout = () => {
  const { cart } = useCart();
  if (!cart) {
    return (
      <Section>
        <h1>Empty cart</h1>
        <Link href={ENUM_ROUTES.PRODUCTS}>Visit Boutique</Link>
      </Section>
    );
  }
  return <Cart />;
};
