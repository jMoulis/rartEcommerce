import { IProductService } from '@/src/types/DBTypes';
import React from 'react';

interface Props {
  products?: IProductService[];
}

export const Services = (props: Props) => {
  return <div>Services</div>;
};
