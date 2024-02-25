'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { Button } from '../../../../commons/Buttons/Button';
import Link from 'next/link';
import { ENUM_ROUTES } from '../../../../navbar/routes.enums';
import CartSummary from '../commons/CartSummary';
import { Section } from '../../../commons/layout/Section';

export const Delivery = () => {
  const { cart, addDeliveryCost } = useCart();

  const getShipmentsMethod = async () => {};
  const t = useTranslations();

  if (!cart) return null;

  return (
    <>
      <Section>
        <Link href={ENUM_ROUTES.CHECKOUT_PAYMENT}>
          {t('Cart.validateShipping')}
        </Link>
        <CartSummary editable={false} />
      </Section>
      <Section>
        <h1>{t('Cart.shipping')}</h1>
        <Button onClick={() => addDeliveryCost(10)}>TestDeliveryCost</Button>
        <Button onClick={getShipmentsMethod}>TestDeliveryCost</Button>
      </Section>
    </>
  );
};
