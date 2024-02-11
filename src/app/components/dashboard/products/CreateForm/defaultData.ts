import { DEFAULT_CURRENCY } from '@/src/lib/constants';
import { IWorkshop, IElement, IProductService, IProperty, IRepetition, ISection, ISession, ITemplate } from '@/src/types/DBTypes';
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
    start: new Date().toISOString(),
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
export const generateDefaultBooking: () => IWorkshop = () => {
  return ({
    categories: [],
    name: '',
    maxParticipants: 0,
    currentParticipantIds: [],
    price: 0,
    currency: DEFAULT_CURRENCY,
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
  currency: DEFAULT_CURRENCY,
  options: {
    refIds: [],
    published: false
  }
});
