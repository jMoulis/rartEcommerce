import { Timestamp } from 'firebase/firestore';
import { ENUM_ROLES } from '../app/contexts/auth/enums';
import { IImageType } from '../app/components/dashboard/products/CreateForm/ImageLoader/types';
import { Frequency, ByWeekday } from '../app/components/dashboard/workshops/Session/types';

export type InvoiceStatusType = 'paid' | 'unpaid' | 'overdue';
export type PaymentMethodType = 'creditCard' | 'bankTransfert' | 'check';
export type OrderStatusType = 'pending' | 'cancelled' | 'converted to invoice';
export type CreditStatusType = 'applied' | 'notApplied';
export type ContactInfoType = 'phone' | 'email';
export type InteractionType = 'call' | 'email' | 'sms' | 'socialNetwork';
export type PurchaseOrderStatusType = 'pending' | 'completed' | 'cancelled';
export type UserRoleType = 'admin' | 'supplier' | 'customer';

export interface ICurrency {
  code: string,
  symbol: string,
}

export interface IStockItem {
  _id: string;
  itemId: string; // Link to IProductService
  quantityOnHand: number;
  reorderPoint: number; // Quantity at which new order should be triggered
  averageCost: number; // Average cost of the item
  createdAt: string;
  updatedAt: string;
}

export interface IProductImage {
  url: string;
  name: string;
  default?: boolean
}
export interface ISection {
  id: string;
  title: string;
  isArchived?: boolean;
  properties: IProperty[];
  published: boolean;
}
export interface IElement {
  id: string;
  label: string;
  technicalName: string;
  component: string;
  value?: string | number | boolean;

}
export interface IProperty {
  id: string;
  align?: 'row' | 'column';
  elements: IElement[]
}
export interface ICategory {
  _id?: string;
  name: string;
  color?: string;
  templates: string[]
}
export interface IProductService {
  _id?: string;
  name: string;
  description: string;
  published: boolean;
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
  images: IProductImage[];
  sections: ISection[];
  price: number;
  currency: ICurrency;
  stockQuantity: number;
  withStock: boolean;
  categories: string[];
  type: 'product' | 'workshop';
  options: {
    refIds: string[];
    published: boolean;
  }
}
export interface IProductServiceWithCategories {
  _id?: string;
  name: string;
  description: string;
  published: boolean;
  isArchived: boolean;
  createdAt?: string;
  updatedAt?: string;
  images: IProductImage[];
  sections: ISection[];
  price: number;
  stockQuantity: number;
  withStock: boolean;
  options: {
    refIds: string[];
    published: boolean;
  }
  categories: ICategory[]
}
export interface ITemplate {
  _id?: string;
  title: string;
  createdAt?: string;
  updatedAt?: string;
  sections: ISection[];
  categories: string[];
}

export interface ILineItem {
  _id?: string;
  itemId: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface IPayment {
  _id: string;
  paymentId: string;
  invoiceId: string;
  datePaid: string;
  amountPaid: number;
  paymentMethod: PaymentMethodType;
}

export interface ICredit {
  creditId: string;
  invoiceId: string;
  issueDate: string;
  amount: number;
  reason: string;
  status: CreditStatusType;
  adjustments?: string[];
}

export interface IAdjustment {
  _id: string;
  adjustmentId: string;
  creditId: string;
  detail: string;
  adjustedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IModification {
  _id: string;
  modificationId: string;
  orderId: string;
  detail: string;
  createdAt: string;
  updatedAt: string;
}

export interface IOrderInput {
  customerId: string | null;
  orderDate: string;
  customerInformations: IContactInformations;
  amount: number;
  ht: number;
  taxes: number;
  lineItems: ILineItem[];
  status: OrderStatusType;
  modifications?: IModification[];
  issueDate?: string;
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
  invoiceId?: string;
}
export interface IOrder extends IOrderInput {
  _id: string;
}

export interface IInvoicesId {
  counter: number;
}
export interface IInvoiceInput {
  invoiceId: string;
  customerId: string | null;
  issueDate: string;
  dueDate: string;
  amount: number;
  ht: number;
  taxes: number;
  status: InvoiceStatusType;
  lineItems: ILineItem[];
  createdAt: string;
  updatedAt: string;
  orderId: string;
  isArchived?: boolean;
  paymentId: string;
  customerInformations: IContactInformations;
  confirmMailSent: {
    status: boolean;
    date?: string;
    messageId?: string
  };
  receiptUrl: string | null
}
export interface IInvoice extends IInvoiceInput {
  _id: string;
}
export interface IContact {
  type: ContactInfoType,
  label: string;
  value: string;
}
export interface IUserCommonInfo {
  lastname: string;
  firstname: string;
  contacts: IContact[];
  address: IAddress[];
  isArchived?: boolean;
}
export interface IUser {
  _id: string;
  userId: string;
  role: UserRoleType;
  commonInfo: IUserCommonInfo;
  specificInfo: IStudentInfo | IEmployeeInfo | ISupplierInfo; // Use Union Types
  interactions: IInteraction[];
  createdAt: string;
  updatedAt: string;
}

// Specific interfaces for different roles
export interface IStudentInfo {
  // Student-specific fields
}

export interface IEmployeeInfo {
  // Employee-specific fields
}

export interface ISupplierInfo {
  // Supplier-specific fields
}

export interface IInteraction {
  _id: string;
  interactionId: string;
  customerId: string;
  date: string;
  notes: string[];
  type: InteractionType;
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id?: string;
  name: string;
  type: 'billing' | 'shipping';
  additional?: string;
  address: string;
  streetNumber: string;
  route: string;
  locality: string;
  country: string;
  countryCode?: string;
  postalCode: string;
  default?: boolean;
}

export interface UserProfile {
  _id?: string;
  avatar: string;
  createdAt?: Timestamp;
  email: string;
  lastConnexion?: Timestamp;
  firstname?: string;
  lastname?: string;
  addresses: IAddress[];
  roles: ENUM_ROLES[];
  token?: string | null;
  verified: boolean;
  verificationDate?: Timestamp;
}

export interface IRepetition {
  occurrencesJsonUrl?: string;
  frequency?: Frequency;
  days?: ByWeekday[];
  end?: string;
  rule?: string;
  interval?: number;
  start?: string;
  _id?: string;
}
export interface IOccurence {
  dayString: string;
  dayNumber: string;
  monthString: string;
  yearString: string;
  time24: string;
  jsDate: Date;
  available: boolean;
  sessionId: string;
}
export interface ISession {
  _id: string; // client generated
  start: string;
  end?: string;
  duration?: number;
  maxParticipants: number;
  calenderId?: string;
  locationId?: string | null; // Location refId
  repetition: IRepetition | null;
  participants: Array<{ email: string, firstname: string, lastname: string, phoneNumber?: string }>;
}

export interface ISubscription {
  _id: string;
  name: string;
  description: string;
  image?: IImageType;
  price: number;
  recurring?: boolean;
  paymentPeriod: 'monthly' | 'weekly' | 'annualy';
  paymentEnding: string;
  priceId?: string | null;
}
export interface IWorkshop {
  _id?: string;
  categories?: string[];
  image?: IProductImage;
  name: string;
  excerpt?: string;
  description?: string;
  currentParticipantIds: string[];
  status?: 'upcoming' | 'ongoing' | 'completed';
  instructorId?: string;
  paymentType?: 'session' | 'subscription',
  paymentPreference?: 'online' | 'person' | 'both' | 'account'
  subscriptionId?: string;
  price: number,
  currency: ICurrency;
  sessions: ISession[];
  pusblished: boolean;
  type: 'product' | 'workshop';
}

export interface ICartItem {
  id: string;
  productId: string;
  name: string;
  description?: string;
  price: number;
  currency: ICurrency;
  quantity: number;
  imageUrl?: string;
  stock: number | null;
  type: 'workshop' | 'product';
  sessions?: ISession[],
}

export interface IContactInformations {
  firstname: string;
  lastname: string;
  email: string;
  address?: IAddress
}
export interface ICart {
  items: ICartItem[];
  currency: ICurrency;
  deliveryCost: number;
  contactInformations: IContactInformations
  totalItems: number;
  totalPrice: number;
}

export interface IShippingContract {
  id: string;
  name: string;
  carrier: {
    code: string;
    name: string;
  };
  client_id: string | null;
  is_active: boolean;
  country: string;
  is_default: boolean;
}
