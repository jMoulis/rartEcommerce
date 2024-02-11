'use client';

import React from 'react';
import { SectionPage } from '../../../../commons/Layouts/SectionPage';
import { Flexbox } from '../../../../commons/Flexbox';
import { useTranslations } from 'next-intl';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { Button } from '../../../../commons/Buttons/Button';
import Link from 'next/link';
import { ENUM_ROUTES } from '../../../../navbar/routes.enums';
import CartSummary from '../commons/CartSummary';
import { Section } from '../../../commons/layout/Section';

export const Delivery = () => {
  const { cart, addDeliveryCost } = useCart();

  const getShipmentsMethod = async () => {
    console.log(cart);
    const example = {
      parcel: {
        name: 'John Doe',
        company_name: 'Sendcloud',
        address: 'Insulindelaan',
        house_number: '115',
        city: 'Eindhoven',
        postal_code: '5642CV',
        telephone: '+31612345678',
        request_label: true,
        email: 'john@doe.com',
        data: {},
        country: 'NL',
        shipment: {
          id: 8,
        },
        weight: '10.000',
        order_number: '1234567890',
        insured_value: 0,
        total_order_value_currency: 'GBP',
        total_order_value: '11.11',
        quantity: 1,
        shipping_method_checkout_name: 'DHL Express Domestic',
      },
    };
    const test = await fetch('/api/shipping').then(async (payload) =>
      payload.json()
    );
    console.log(test);
  };
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
