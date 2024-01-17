import { IProductService, IProperty, ISection } from '@/src/types/DBTypes';
import { v4 } from 'uuid';

export const defaultProperty = (): IProperty => {
  const id = v4();
  return ({
    id,
    label: '',
    component: '',
    technicalName: '',
  });
};

export const defaultSection = (): ISection => {
  const id = v4();
  return ({
    id,
    title: 'ProductForm.newSection',
    properties: []
  });
};

export const defaultProduct = (): IProductService => ({
  name: '',
  description: '',
  images: [],
  isActive: false,
  sections: [],
});
