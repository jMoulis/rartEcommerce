'use client';

import styled from '@emotion/styled';
import { ICart } from '@/src/types/DBTypes';
import React from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import { useTranslations } from 'next-intl';
import { BillingInformation } from '../commons/BillingInformation';
import { ShippingInformation } from '../commons/ShippingInformation';

const Root = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid var(--primary-color);
  padding: 20px;
  border-radius: 10px;
`;
const FeesWrapper = styled(Flexbox)`
  margin: 10px 0;
`;
const ActionWrapper = styled(Flexbox)`
  margin: 10px 0;
  @media (max-width: 768px) {
    margin: 5px;
  }
`;
const Title = styled.h2`
  font-size: 30px;
  color: var(--primary-color);
  @media (max-width: 768px) {
    font-size: 17px;
  }
`;
const Total = styled.h3`
  font-size: 25px;
`;
const Currency = styled.span`
  margin-left: 3px;
`;
const Price = styled.h3`
  font-size: 25px;
  white-space: nowrap;
`;
const List = styled.ul`
  flex: 1;
  margin-bottom: 10px;
`;
const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin: 7px 0;
  font-size: 13px;
`;

interface Props {
  cart: ICart;
  Action?: React.ReactNode;
}
export default function CartTotal({ cart, Action }: Props) {
  const t = useTranslations();

  const calculateTotal = (): number => {
    return cart.totalPrice + cart.deliveryCost;
  };
  return (
    <Root>
      <Title>{t('Cart.summary')}</Title>
      <Flexbox alignItems='center' justifyContent='space-between'>
        <List>
          {cart.items.map((item, key) => (
            <ListItem key={key}>
              <span>{item.name}</span>
              <Flexbox>
                <span>{item.price}</span>
                <Currency>{cart.currency?.symbol}</Currency>
              </Flexbox>
            </ListItem>
          ))}
        </List>
      </Flexbox>

      <FeesWrapper flexDirection='column'>
        <Flexbox justifyContent='space-between'>
          <span>{`${t('Cart.noTaxes')}`}</span>
          <Flexbox>
            <span>{cart.totalPrice}</span>
            <Currency>{cart.currency?.symbol}</Currency>
          </Flexbox>
        </Flexbox>
        <Flexbox justifyContent='space-between'>
          <span>{t('Cart.shippingCost')}</span>
          <Flexbox>
            <span>{cart.deliveryCost}</span>
            <Currency>{cart.currency?.symbol}</Currency>
          </Flexbox>
        </Flexbox>
      </FeesWrapper>
      <Flexbox justifyContent='space-between'>
        <Flexbox alignItems='baseline'>
          <Total>{t('Cart.total')}</Total>
          <Currency>TTC</Currency>
        </Flexbox>
        <Flexbox>
          <Price>{calculateTotal()}</Price>
          <Currency>{cart.currency?.symbol}</Currency>
        </Flexbox>
      </Flexbox>
      <BillingInformation />
      <ShippingInformation />
      <ActionWrapper>{Action}</ActionWrapper>
    </Root>
  );
}
