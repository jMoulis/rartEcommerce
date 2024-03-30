import { faBasketShopping } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from '@emotion/styled';
import { useCart } from '../../contexts/cart/CartContext';
import { ENUM_ROUTES } from './routes.enums';
import { ButtonLink } from '../client/checkout/processing/commons/ButtonLink';

const Counter = styled.span`
  position: absolute;
  height: 15px;
  width: 15px;
  background-color: var(--tertiary-accent-2);
  border-radius: 30px;
  color: #fff;
  bottom: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

export const CartMenu = () => {
  const { cart } = useCart();
  if (cart?.items?.length === 0) return null;
  return (
    <ButtonLink
      href={ENUM_ROUTES.CHECKOUT_CART}
      style={{
        borderRadius: '100%',
        minHeight: '30px',
        minWidth: '30px',
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {cart?.totalItems ? <Counter>{cart.totalItems}</Counter> : null}
      <FontAwesomeIcon icon={faBasketShopping} />
    </ButtonLink>
  );
};
