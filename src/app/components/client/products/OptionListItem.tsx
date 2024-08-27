import React, { Fragment, useCallback } from 'react';
import styled from '@emotion/styled';
import { IProductService, IProperty } from '@/src/types/DBTypes';
import { Flexbox } from '../../commons/Flexbox';
import { displayPrice } from '@/src/lib/utils/main';
import { useTranslations } from 'next-intl';

const Root = styled.button<{ selected: boolean }>`
  min-height: 100%;
  min-width: fit-content;
  border: 1px solid
    ${({ selected }) => (selected ? 'var(--primary-color)' : 'rgba(0,0,0,0.4)')};
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 5px;
  &:hover {
  }
  & * {
    color: ${({ selected }) =>
      selected ? 'var(--primary-color)' : 'rgba(0,0,0,0.4)'};
  }
`;

const Header = styled.header<{ selected: boolean }>`
  padding: 2px 5px;
  border-bottom: 1px solid
    ${({ selected }) => (selected ? 'var(--primary-color)' : 'rgba(0,0,0,0.4)')};
`;
const OptionPrice = styled.p`
  display: flex;
  font-size: 13px;
`;
const StockDot = styled.div<{ status: boolean }>`
  height: 7px;
  width: 7px;
  border-radius: 100%;
  display: flex;
  background-color: ${({ status }) => (status ? '#008a00' : 'red')};
`;
const Stock = styled.p<{ status: boolean }>`
  display: flex;
  margin-right: 5px;
  font-size: 10px;
  color: ${({ status }) => (status ? '#008a00' : 'red')};
`;
const OptionName = styled.p`
  font-weight: bold;
  font-size: 15px;
`;
const InputsWrapper = styled(Flexbox)`
  display: flex;
  flex-wrap: wrap;
`;
const PropertyWrapper = styled(Flexbox)`
  label: PropertyWrapper;
  position: relative;
  &:hover {
    .edit-button {
      display: flex;
    }
  }
`;

interface Props {
  product: IProductService;
  selectedProduct: IProductService | null;
  onSelectProduct: (product: IProductService) => void;
}
const OptionListItem = ({
  product,
  onSelectProduct,
  selectedProduct
}: Props) => {
  const t = useTranslations();

  const renderProperty = useCallback((property: IProperty) => {
    return (
      <PropertyWrapper alignItems='center'>
        <InputsWrapper flexDirection={property.align ?? 'column'} flex='1'>
          {property.elements.map((element, key) => {
            return <OptionName key={key}>{element.value}</OptionName>;
          })}
        </InputsWrapper>
      </PropertyWrapper>
    );
  }, []);
  return (
    <Root
      selected={selectedProduct?._id === product._id}
      onClick={() => onSelectProduct(product)}>
      <Header selected={selectedProduct?._id === product._id}>
        {product.sections
          .filter((section) => section.published)
          .map((section) => {
            return section.properties.map((property, index) => {
              return (
                <Fragment key={index}>{renderProperty(property)}</Fragment>
              );
            });
          })}
      </Header>
      <Flexbox
        flexDirection='column'
        justifyContent='space-between'
        flex='1'
        style={{
          padding: '5px'
        }}>
        <OptionPrice>{displayPrice(product.price)}</OptionPrice>
        {product.withStock ? (
          <>
            <Flexbox alignItems='center'>
              <Stock status={product.stockQuantity > 0}>
                {t(
                  product.stockQuantity > 0
                    ? 'Product.inStock'
                    : 'Product.noStock'
                )}
              </Stock>
              <StockDot status={product.stockQuantity > 0} />
            </Flexbox>
          </>
        ) : null}
      </Flexbox>
    </Root>
  );
};
export default OptionListItem;
