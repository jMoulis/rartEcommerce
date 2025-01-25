import React from 'react';
import CartTotal from '../cart/CartTotal';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { EmptyCart } from '../cart/EmptyCart';
import styled from '@emotion/styled';

const Wrapper = styled(Flexbox)`
  padding: 10px;
  width: 40%;
  @media (max-width: 768px) {
    width: 100%;
    padding: 10px 0;
  }
`;
// const Securised = dynamic(async () => import('../cart/Securised'), {
//   ssr: false,
// });
interface Props {
  editable: boolean;
  Action?: React.ReactNode;
  flexDirection?: 'row' | 'column';
}

const CartSummary = ({ Action }: Props) => {
  const { cart } = useCart();
  if (!cart) return null;

  return (
    <>
      {cart?.items.length ? (
        <Wrapper flexDirection='column'>
          <CartTotal cart={cart} Action={Action} />
        </Wrapper>
      ) : (
        <EmptyCart />
      )}
    </>
  );
};

export default CartSummary;
