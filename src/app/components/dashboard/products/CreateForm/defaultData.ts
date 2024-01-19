import { IElement, IProductService, IProperty, ISection, ITemplate } from '@/src/types/DBTypes';
import { v4 } from 'uuid';

export const defaultElement = (): IElement => {
  const id = v4();
  return ({
    id,
    label: '',
    technicalName: '',
    component: 'INPUT',

  });
};
export const defaultProperty = (): IProperty => {
  const id = v4();
  return ({
    id,
    elements: []
  });
};

export const defaultSection: (t: any) => ISection = (t) => {
  const id = v4();
  return ({
    id,
    title: t('ProductForm.newSection'),
    properties: [],
    published: false,
  });
};
export const buildDefaultTemplate: (t: any) => ITemplate = (t) => {
  return ({
    title: t('Template.newTemplate'),
    sections: [],
    categories: []
  });
};

export const defaultProduct = (): IProductService => ({
  name: '',
  description: '',
  images: [],
  published: false,
  sections: [],
  isArchived: false,
  price: 0,
  stockQuantity: 0,
  withStock: false,
  categories: [],
  options: {
    refIds: [],
    published: false
  }
});
