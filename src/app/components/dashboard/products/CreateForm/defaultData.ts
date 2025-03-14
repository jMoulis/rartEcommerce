import { ENUM_ROLES } from '@/src/app/contexts/auth/enums';
import { DEFAULT_CURRENCY } from '@/src/lib/constants';
import { IWorkshop, IElement, IProductService, IProperty, IRepetition, ISection, ISession, ITemplate, ICustomer, IArtwork, IInvoiceInput } from '@/src/types/DBTypes';
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
export const defaultArtwork: () => IArtwork = () => {
  return ({
    name: '',
    sections: [],
    categories: [],
    images: [],
    isArchived: false,
    published: false,
    description: '',
  });
};
export const generateDefaultSession: (workshop: IWorkshop) => ISession = (workshop) => {
  const _id = v4();
  return ({
    _id,
    start: new Date().toISOString(),
    participants: [],
    repetition: null,
    maxParticipants: 0,
    duration: 0,
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
    published: false,
    paymentPreference: 'online',
    type: 'workshop',
    sections: []
  });
};
export const generateDefaultCustomer: () => ICustomer = () => {
  return ({
    firstname: '',
    lastname: '',
    email: '',
    roles: [ENUM_ROLES.VISITOR],
    sections: [],
    addresses: [],
    verified: false,
    invoices: [],
    categories: []
  });
};
export const generateDefaultInvoice: () => IInvoiceInput = () => {
  return ({
    createdAt: new Date().toISOString(),
    invoiceId: '',
    customerId: '',
    status: 'unpaid',
    amount: 0,
    ht: 0,
    taxes: 0,
    lineItems: []
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
  type: 'product',
  delivery: {
    width: '0',
    height: '0',
    weight: '0'
  },
  options: {
    refIds: [],
    published: false
  }
});
