import { IBooking, IElement, IProductService, IProperty, IRepetition, ISection, ISession, ITemplate } from '@/src/types/DBTypes';
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
export const generateDefaultSession: () => ISession = () => {
  const _id = v4();
  return ({
    _id,
    start: '',
    people: [],
  });
};
export const generateDefaultRepetition: (startDate?: string) => IRepetition = (startDate) => {
  const _id = v4();
  return ({
    start: startDate,
    end: '',
    rule: '',
    days: [],
    interval: 1,
    _id
  });
};
export const generateDefaultBooking: () => IBooking = () => {
  return ({
    categories: [],
    name: '',
    maxParticipants: 0,
    currentParticipantIds: [],
    price: 0,
    sessions: [],
    pusblished: false,
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
