import { IProductService } from '@/src/types/DBTypes';
import React from 'react';

interface Props {
  inventory?: IProductService[];
}

export const Categories = (props: Props) => {
  return <h1>Categories</h1>;
};
