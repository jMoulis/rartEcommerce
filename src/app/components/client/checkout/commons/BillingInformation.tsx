import { useCart } from '@/src/app/contexts/cart/CartContext';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';

const Root = styled.div`
  margin: 10px 0;
  border-top: 1px solid var(--primary-color);
  padding: 5px;
`;
const Title = styled.h4`
  color: var(--primary-color);
`;
const Text = styled.p`
  font-size: 14px;
`;
interface Props {}

export const BillingInformation = (props: Props) => {
  const t = useTranslations();

  const { cart } = useCart();

  if (!cart?.contactInformations?.address) return null;

  return (
    <Root>
      <Title>{t('Cart.billingAddress')}</Title>
      <Flexbox>
        <Text>{cart.contactInformations.firstname}</Text>
        <Text>{cart.contactInformations.lastname}</Text>
      </Flexbox>
      <Text>{cart.contactInformations.address?.address}</Text>
      <Flexbox>
        <Text>{cart.contactInformations.address?.postalCode}</Text>
        <Text>{cart.contactInformations.address?.locality}</Text>
      </Flexbox>
    </Root>
  );
};
