import React from 'react';
import { Button } from '../../../../commons/Buttons/Button';
import { IProductService, IWorkshop } from '@/src/types/DBTypes';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { useTranslations } from 'next-intl';
import { Bounce, toast } from 'react-toastify';

interface Props {
  item: IProductService | IWorkshop;
  label?: string;
}

const ItemAddConfirmation = ({
  item,
}: {
  item: IProductService | IWorkshop;
}) => {
  return <div>{item.name}</div>;
};
export const AddToCart = ({ item, label }: Props) => {
  const t = useTranslations();
  const { addToCart } = useCart();
  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    addToCart(item, item.type);
    toast(<ItemAddConfirmation item={item} />, {
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
    <Button onClick={handleAddToCart}>{label ?? t('Cart.addToCart')}</Button>
  );
};
