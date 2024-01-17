'use client';

import { IProductService } from '@/src/types/DBTypes';
import React from 'react';
import { CreateForm } from '../CreateForm/CreateForm';

interface Props {
  product?: IProductService;
}

export const ProductDetail = ({ product }: Props) => {
  return <CreateForm prevProduct={product} />;
};
