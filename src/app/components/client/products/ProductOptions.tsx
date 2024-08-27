import { IProductService } from '@/src/types/DBTypes';
import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
import { ProductSection } from './ProductSection';
import styled from '@emotion/styled';
import { onFetchDocsByIdsArray } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import OptionList from './OptionList';
import { displayPrice } from '@/src/lib/utils/main';
import { Flexbox } from '../../commons/Flexbox';
import { useTranslations } from 'next-intl';
import { IconButton } from '../../commons/Buttons/IconButton';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { AddToCart } from '../checkout/cart/AddToCart';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { Button } from '../../commons/Buttons/Button';
import { ButtonLink } from '../checkout/commons/ButtonLink';
import { ENUM_ROUTES } from '../../navbar/routes.enums';

const Root = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    max-width: 100vw;
    flex-direction: column;
  }
`;
const Title = styled.h2`
  color: var(--primary-color);
  margin-bottom: 10px;
`;
const ProductName = styled.p`
  display: flex;
  align-items: center;
`;
const Price = styled(ProductName)`
  font-weight: bold;
  text-align: end;
`;
const Description = styled.p`
  margin-bottom: 10px;
  text-align: justify;
`;
const ContentWrapper = styled(Flexbox)`
  margin: 0 10px;
  @media (max-width: 768px) {
    margin: 0;
  }
`;
const EmptySpan = styled.hr`
  border: none;
`;
const PriceGridWrapper = styled(Flexbox)`
  margin: 0 10px;
  flex: 1;
  @media (max-width: 768px) {
    margin: 0;
  }
`;
const PriceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 30px;
  gap: 10px;
  grid-auto-rows: 30px;
  margin-bottom: 10px;
  align-content: center;
  justify-content: center;
`;
interface Props {
  product: IProductService;
  preview?: boolean;
}

export const ProductOptions = ({ product, preview }: Props) => {
  const t = useTranslations();
  const { cart, onDeleteItemFromCart } = useCart();
  const [selectedProduct, setSelectedProduct] =
    useState<IProductService>(product);
  const [options, setOptions] = useState<IProductService[]>([]);
  const sections = useMemo(() => {
    return selectedProduct.sections.filter((section) => section.published);
  }, [selectedProduct.sections]);

  const [selectedProductOptions, setSelectedProductOptions] = useState<
    Map<string, IProductService>
  >(new Map());

  const fetchProducts = useCallback(async () => {
    try {
      const { data: products } = await onFetchDocsByIdsArray(
        product.options.refIds,
        ENUM_COLLECTIONS.PRODUCTS
      );
      setOptions([product, ...products]);
    } catch (error) {}
  }, [product]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectProduct = (product: IProductService) => {
    setSelectedProductOptions(new Map());
    setSelectedProduct(product);
  };

  const handleSelectOption = (product: IProductService, propertyId: string) => {
    setSelectedProductOptions((prev) => {
      const newMap = new Map(prev);
      newMap.set(propertyId, product);
      return newMap;
    });
  };

  const handleRemoveItem = (propertyId: string) => {
    setSelectedProductOptions((prev) => {
      const newMap = new Map(prev);
      newMap.delete(propertyId);
      return newMap;
    });
  };

  const isIncart = useMemo(
    () =>
      (cart?.items ?? []).find((item) => item.productId === product._id)
        ?.quantity ?? 0,
    [cart, product]
  );

  const totalPrice = useMemo(() => {
    let total = selectedProduct.price;
    Array.from(selectedProductOptions.values()).forEach((product) => {
      total += product.price;
    });
    return total;
  }, [selectedProductOptions, selectedProduct.price]);

  return (
    <Root>
      <ContentWrapper flexDirection='column' flex='1'>
        <Title>{product.name}</Title>
        <Description>{selectedProduct.description}</Description>
        {product.options?.published && options.length > 1 && (
          <OptionList
            products={options}
            onSelectProduct={handleSelectProduct}
            selectedProduct={selectedProduct}
          />
        )}
        {sections.map((section, key) => (
          <ProductSection
            key={key}
            section={section}
            preview={preview}
            onSelectOption={handleSelectOption}
            selectedProductOptions={selectedProductOptions}
          />
        ))}
      </ContentWrapper>
      <PriceGridWrapper flexDirection='column'>
        <PriceGrid>
          <ProductName>{product.name}</ProductName>
          <Price>{displayPrice(selectedProduct.price)}</Price>
          <EmptySpan />
          {selectedProductOptions.size ? (
            <>
              {Array.from(selectedProductOptions.entries()).map(
                ([propertyId, product], index) => (
                  <Fragment key={index}>
                    <ProductName>{product.name}</ProductName>
                    <Price>{displayPrice(product.price)}</Price>
                    <Flexbox alignItems='center'>
                      <IconButton
                        variant='xs'
                        icon={faTrash}
                        onClick={() => handleRemoveItem(propertyId)}
                      />
                    </Flexbox>
                  </Fragment>
                )
              )}
            </>
          ) : null}

          <ProductName
            style={{
              fontWeight: 'bold',
              borderTop: '1px solid var(--primary-color)',
              paddingTop: '5px'
            }}>
            {t('commons.total')}
          </ProductName>
          <Price
            style={{
              borderTop: '1px solid var(--primary-color)',
              paddingTop: '5px'
            }}>
            {displayPrice(totalPrice)}
          </Price>
          <EmptySpan />
        </PriceGrid>
        {isIncart ? (
          <Flexbox alignItems='center'>
            <Button
              style={{
                background: 'rgba(255,0,0,0.4)'
              }}
              onClick={() => onDeleteItemFromCart(product._id!)}>
              {t('Cart.deleteFromCart')}
            </Button>
            <ButtonLink href={ENUM_ROUTES.CHECKOUT_CART}>
              {t('Cart.seeCart')}
            </ButtonLink>
          </Flexbox>
        ) : (
          <AddToCart
            withPreviewCart
            items={[
              selectedProduct,
              ...Array.from(selectedProductOptions.values())
            ]}
          />
        )}
      </PriceGridWrapper>
    </Root>
  );
};
