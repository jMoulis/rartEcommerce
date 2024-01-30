import { IProductService } from '@/src/types/DBTypes';
import React, { useMemo } from 'react';
import { ProductSection } from './ProductSection';
import styled from '@emotion/styled';

const Root = styled.div`
  max-width: 20%;
`;
const Title = styled.h2``;
const Price = styled.p``;
const Description = styled.p``;
interface Props {
  product: IProductService;
}

export const ProductOptions = ({ product }: Props) => {
  const sections = useMemo(() => {
    return product.sections.filter((section) => section.published);
  }, [product.sections]);
  return (
    <Root>
      <Title>{product.name}</Title>
      <Description>{product.description}</Description>
      <Price>{product.price}€</Price>
      {sections.map((section, key) => (
        <ProductSection key={key} section={section} />
      ))}
    </Root>
  );
};
