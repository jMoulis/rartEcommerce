export type InvoiceStatusType = 'paid' | 'unpaid' | 'overdue';
export type PaymentMethodType = 'creditCard' | 'bankTransfert' | 'check';
export type OrderStatusType = 'pending' | 'cancelled' | 'converted to invoice';
export type CreditStatusType = 'applied' | 'notApplied';
export type ContactInfoType = 'phone' | 'email';
export type InteractionType = 'call' | 'email' | 'sms' | 'socialNetwork';
export type PurchaseOrderStatusType = 'pending' | 'completed' | 'cancelled';
export type UserRoleType = 'student' | 'employee' | 'supplier' | 'customer';

export interface IPurchaseOrder {
  _id: string;
  purchaseOrderId: string;
  supplierId: string;
  orderDate: string;
  expectedDeliveryDate: string;
  lineItems: ILineItem[]; // Could be similar to ILineItem in IOrder
  totalAmount: number;
  status: PurchaseOrderStatusType;
  createdAt: string;
  updatedAt: string;
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

export interface IProductService {
  _id: string;
  itemId: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  imageUrls: string[];
  stockItemId?: string;
  isActive: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ILineItem {
  _id: string;
  itemId: string;
  description: string;
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

export interface IOrder {
  _id: string;
  orderId: string;
  invoiceId?: string;
  customerId: string;
  orderDate: string;
  lineItems: ILineItem[];
  status: OrderStatusType;
  modifications?: IModification[];
  createdAt: string;
  updatedAt: string;
  isArchived?: boolean;
}

export interface IInvoice {
  _id: string;
  invoiceId: string;
  customerId: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  status: InvoiceStatusType;
  lineItems: ILineItem[];
  createdAt: string;
  updatedAt: string;
  orderId?: string;
  isArchived?: boolean;
}

export interface AddressType {
  addressId: string;
  label: string;
  streetName: string;
  number: string;
  postalCode: string;
  city: string;
  country: string;
  default: boolean;
  createdAt: string;
  updatedAt: string;
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
  address: AddressType[];
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
