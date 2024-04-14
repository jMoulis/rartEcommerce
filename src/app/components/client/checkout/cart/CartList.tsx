import React from 'react';
import styled from '@emotion/styled';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import CartListItem from '../cart/CartListItem';

const ListCart = styled.ul`
  width: 60%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CartList = () => {
  const { cart } = useCart();

  if (!cart) return null;

  return (
    <ListCart>
      {cart.items.map((item, key) => (
        <CartListItem key={key} item={item} editable />
      ))}
    </ListCart>
  );
};

export default CartList;
