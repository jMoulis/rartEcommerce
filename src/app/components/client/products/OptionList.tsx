import { IProductService } from '@/src/types/DBTypes';
import React from 'react';
import styled from '@emotion/styled';
import OptionListItem from './OptionListItem';

const List = styled.ul`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

interface Props {
  products: IProductService[];
  onSelectProduct: (product: IProductService) => void;
  selectedProduct: IProductService | null;
}

const OptionList = ({ products, onSelectProduct, selectedProduct }: Props) => {
  const filteredProducts = products.filter(
    (section) => section.options?.published
  );
  return (
    <List>
      {filteredProducts.map((product) => (
        <OptionListItem
          key={product._id}
          product={product}
          selectedProduct={selectedProduct}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </List>
  );
};
export default OptionList;
