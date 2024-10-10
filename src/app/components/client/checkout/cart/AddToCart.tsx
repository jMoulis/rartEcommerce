import React from 'react';
import { Button } from '../../../commons/Buttons/Button';
import { IProductService, IWorkshop } from '@/src/types/DBTypes';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { useTranslations } from 'next-intl';
import { Bounce, toast } from 'react-toastify';
import { ButtonLink } from '../commons/ButtonLink';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import styled from '@emotion/styled';

const Root = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
`;

const ItemAddConfirmation = ({
  items,
}: {
  items: IProductService[] | IWorkshop[];
}) => {
  return <div>{items.map((item) => item.name)}</div>;
};
interface Props {
  items: IProductService[] | IWorkshop[];
  label?: string;
  withPreviewCart: boolean;
}
export const AddToCart = ({ items, label, withPreviewCart }: Props) => {
  const t = useTranslations();
  const { addToCart, cart } = useCart();
  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    items.forEach((item) => {
      addToCart(item, item.type);
    });
    // addToCart(item, item.type);
    toast(<ItemAddConfirmation items={items} />, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'dark',
      transition: Bounce,
    });
  };

  return (
    <Root>
      <Button onClick={handleAddToCart}>{label ?? t('Cart.addToCart')}</Button>
      {withPreviewCart && cart?.items?.length ? (
        <ButtonLink href={ENUM_ROUTES.CHECKOUT_CART}>
          {label ?? t('Cart.seeCart')}
        </ButtonLink>
      ) : null}
    </Root>
  );
};
