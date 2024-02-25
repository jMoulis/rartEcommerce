import React from 'react';
import CartTotal from '../cart/CartTotal';
import styled from '@emotion/styled';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import CartListItem from '../cart/CartListItem';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { EmptyCart } from '../cart/EmptyCart';
import dynamic from 'next/dynamic';

const ListCart = styled.ul``;
const Securised = dynamic(async () => import('../cart/Securised'), {
  ssr: false,
});
interface Props {
  editable: boolean;
  Action?: React.ReactNode;
  flexDirection?: 'row' | 'column';
}

const CartSummary = ({ editable, Action, flexDirection }: Props) => {
  const { cart } = useCart();

  if (!cart) return null;

  return (
    <>
      <Flexbox flexDirection={flexDirection}>
        {cart?.items.length ? (
          <>
            <ListCart>
              {cart.items.map((item, key) => (
                <CartListItem key={key} item={item} editable={editable} />
              ))}
            </ListCart>
            <CartTotal cart={cart} Action={Action} />
            <Securised />
          </>
        ) : (
          <EmptyCart />
        )}
      </Flexbox>
    </>
  );
};

export default CartSummary;
