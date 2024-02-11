import React from 'react';
import { Button } from '../../../../commons/Buttons/Button';
import { IProductService, IWorkshop } from '@/src/types/DBTypes';
import { useCart } from '@/src/app/contexts/cart/CartContext';

interface Props {
  item: IWorkshop | IProductService;
}

export const AddToCart = ({ item }: Props) => {
  const { addToCart } = useCart();
  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.stopPropagation();
    const updatedCart = addToCart(item);
  };
  return <Button onClick={handleAddToCart}>AddToCart</Button>;
};
