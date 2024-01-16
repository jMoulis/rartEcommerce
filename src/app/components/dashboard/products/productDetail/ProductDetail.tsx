'use client';

import { IProductService } from '@/src/types/DBTypes';
import React from 'react';

interface Props {
  product?: IProductService;
}

export const ProductDetail = (props: Props) => {
  console.log(props);
  return <h1>ProductDetail</h1>;
};
