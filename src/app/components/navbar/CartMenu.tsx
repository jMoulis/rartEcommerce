import { faBasketShopping } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from '@emotion/styled';
import { useCart } from '../../contexts/cart/CartContext';
import Link from 'next/link';
import { ENUM_ROUTES } from './routes.enums';

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

const CustomLink = styled(Link)`
  position: relative;
  padding: 10px;
  border: 1px solid #fff;
  border-radius: 8px;
  color: #fff;
  margin: 0 10px;
  &:hover {
    background-color: var(--primary-accent);
    border: 1px solid transparent;
    color: var(--default-font-color);
  }
`;

export const CartMenu = () => {
  const { cart } = useCart();
  return (
    <CustomLink href={ENUM_ROUTES.CHECKOUT_CART}>
      {cart?.totalItems ? <Counter>{cart.totalItems}</Counter> : null}
      <FontAwesomeIcon icon={faBasketShopping} />
    </CustomLink>
  );
};
