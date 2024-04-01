import React, { ChangeEvent, useCallback, useMemo } from 'react';
import { Card } from '../home/Card';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { ICartItem, IProductImage, IProductService } from '@/src/types/DBTypes';
import { Selectbox } from '../../commons/form/Selectbox';
import { AddToCart } from '../checkout/processing/cart/AddToCart';
import { Button } from '../../commons/Buttons/Button';
import { useTranslations } from 'next-intl';
import { useQuantityOptions } from './useQuantityOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { Flexbox } from '../../commons/Flexbox';

interface Props {
  product: IProductService;
}

export const ProductListItem = ({ product }: Props) => {
  const { cart, onDeleteItemFromCart, onEditCart } = useCart();
  const quantityOptions = useQuantityOptions(product.stockQuantity);

  const t = useTranslations();

  const imageProduct = useMemo(() => {
    const defaultImage: IProductImage | undefined =
      product.images.find((image) => image.default) ?? product.images[0];
    return defaultImage?.url;
  }, []);

  const handleSelectQuantity = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    const item = (cart?.items ?? []).find(
      (prevItem) => prevItem.productId === product._id
    );
    if (!item) return;
    const updatedItem: ICartItem = {
      ...item,
      quantity: parseFloat(value),
    };
    if (parseFloat(value) >= 1) {
      onEditCart(updatedItem);
    } else {
      onDeleteItemFromCart(item.id);
    }
  };
  const isIncart = useMemo(
    () =>
      (cart?.items ?? []).find((item) => item.productId === product._id)
        ?.quantity ?? 0,
    [cart, product]
  );

  const handleDeleteFromCart = (productId: string) => {
    const item = (cart?.items ?? []).find(
      (prevItem) => prevItem.productId === productId
    );
    if (!item) return;
    onDeleteItemFromCart(item.id);
  };

  const renderCardFooter = useCallback(() => {
    if (!product.withStock) {
      if (isIncart) {
        return null;
      }
      return <AddToCart withPreviewCart={false} items={[product]} />;
    }

    if (product.stockQuantity === 0) {
      return (
        <Button
          style={{
            background: 'rgba(0,0,255,0.4)',
          }}>
          {t('Booking.keepMeInform')}
        </Button>
      );
    }
    if (isIncart) {
      return (
        <Selectbox
          styling={{
            root: {
              marginBottom: 0,
            },
          }}
          label=''
          id={product._id!}
          name='quantity'
          onChangeSelectbox={handleSelectQuantity}
          options={quantityOptions}
          value={String(isIncart) ?? 0}
        />
      );
    }
    return <AddToCart withPreviewCart={false} items={[product]} />;
  }, [product.withStock, product.stockQuantity, isIncart, quantityOptions]);

  return (
    <Card
      textColor='var(--primary-color)'
      boxShadow='rgba(8, 91, 121, 0.1)'
      src={imageProduct}
      title={product.name}
      price={product.price}
      description={product.description}
      id={product._id!}
      hrefRoot='products'>
      <Flexbox>
        {renderCardFooter()}
        {isIncart ? (
          <Button
            style={{
              background: 'rgba(255,0,0,0.4)',
            }}
            onClick={() => handleDeleteFromCart(product._id!)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        ) : null}
      </Flexbox>
    </Card>
  );
};
