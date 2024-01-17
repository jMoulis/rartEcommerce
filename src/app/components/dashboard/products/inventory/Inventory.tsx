import { IProductService } from '@/src/types/DBTypes';
import React from 'react';

interface Props {
  inventory?: IProductService[];
}

export const Inventory = (props: Props) => {
  return <h1>Inventory</h1>;
};
