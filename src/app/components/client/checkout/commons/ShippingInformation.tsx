import { useCart } from '@/src/app/contexts/cart/CartContext';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import { Button } from '../../../commons/Buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/pro-light-svg-icons';

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
interface Props {
  onEditAddress?: () => void;
}

export const ShippingInformation = (props: Props) => {
  const t = useTranslations();

  const { cart } = useCart();
  if (!cart?.contactInformations?.shippingAddress) return null;

  return (
    <Root>
      <Flexbox>
        <Title>{t('Cart.shippingAddress')}</Title>
        {props.onEditAddress ? (
          <Button onClick={props.onEditAddress}>
            <FontAwesomeIcon icon={faEdit as any} />
          </Button>
        ) : null}
      </Flexbox>
      <Flexbox>
        <Text>{cart.contactInformations.firstname}</Text>
        <Text>{cart.contactInformations.lastname}</Text>
      </Flexbox>
      <Text>{cart.contactInformations.shippingAddress.address}</Text>
      <Flexbox>
        <Text>{cart.contactInformations.shippingAddress.postalCode}</Text>
        <Text>{cart.contactInformations.shippingAddress.locality}</Text>
      </Flexbox>
    </Root>
  );
};
