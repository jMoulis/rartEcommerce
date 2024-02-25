'use client';

import styled from '@emotion/styled';
import { ICart } from '@/src/types/DBTypes';
import React from 'react';
import { Flexbox } from '../../../../commons/Flexbox';
import { useTranslations } from 'next-intl';

const Root = styled.div``;
const Total = styled.h3`
  font-size: 25px;
`;

const Price = styled.h3`
  font-size: 25px;
  white-space: nowrap;
`;

interface Props {
  cart: ICart;
  Action?: React.ReactNode;
  deliveryFees?: number;
}
export default function CartTotal({ cart, Action, deliveryFees }: Props) {
  const t = useTranslations();
  return (
    <Root>
      {Action}
      <h2>{t('Cart.summary')}</h2>
      <Flexbox alignItems='center' justifyContent='space-between'>
        <Flexbox alignItems='center'>
          <span>{t('Cart.item')}</span>
          <span>{`(${cart.totalItems})`}</span>
        </Flexbox>
        <p>
          {cart.totalPrice}
          {cart.currency?.symbol}
        </p>
      </Flexbox>
      {cart.deliveryCost ? (
        <>
          <Flexbox justifyContent='space-between'>
            <span>{t('Cart.shippingCost')}</span>
            <span>
              {cart.deliveryCost}
              {cart.currency?.symbol}
            </span>
          </Flexbox>
          <Flexbox justifyContent='space-between'>
            <Flexbox flexDirection='column'>
              <Total>{t('Cart.total')}</Total>
            </Flexbox>
            <Price>
              {cart.totalPriceAndDelivery}
              {cart.currency?.symbol}
            </Price>
          </Flexbox>
        </>
      ) : (
        <Flexbox justifyContent='space-between'>
          <Flexbox flexDirection='column'>
            <Total>{t('Cart.total')}</Total>
            <span>{t('Cart.plusDelivery')}</span>
          </Flexbox>
          <Price>
            {cart.totalPrice}
            {cart.currency?.symbol}
          </Price>
        </Flexbox>
      )}
    </Root>
  );
}
