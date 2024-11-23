import { faBasketShopping } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from '@emotion/styled';
import { useCart } from '../../contexts/cart/CartContext';
import { ENUM_ROUTES } from './routes.enums';
import { ButtonLink } from '../client/checkout/commons/ButtonLink';

const CustomLink = styled(ButtonLink)<{ isScrolled: boolean }>`
  background-color: ${({ isScrolled }) =>
    isScrolled ? '#fff' : 'transparent'};
  & *:not(span) {
    color: ${({ isScrolled }) =>
      isScrolled ? 'var(--primary-color)' : '#fff'};
  }
  & span {
    color: #fff;
  }
`;
const Counter = styled.span`
  position: absolute;
  height: 15px;
  width: 15px;
  background-color: var(--secondary-accent);
  border-radius: 30px;
  color: #fff;
  bottom: -5px;
  right: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;
interface Props {
  isScrolled: boolean;
}
export const CartMenu = ({ isScrolled }: Props) => {
  const { cart } = useCart();
  if (!cart?.items?.length) {
    return (
      <div
        style={{
          width: '30px'
        }}
      />
    );
  }
  return (
    <CustomLink
      isScrolled={isScrolled}
      href={ENUM_ROUTES.CHECKOUT}
      style={{
        borderRadius: '100%',
        minHeight: '30px',
        minWidth: '30px',
        padding: 0,
        alignItems: 'center',
        justifyContent: 'center'
      }}>
      {cart?.totalItems ? <Counter>{cart.totalItems}</Counter> : null}
      <FontAwesomeIcon icon={faBasketShopping as any} />
    </CustomLink>
  );
};
