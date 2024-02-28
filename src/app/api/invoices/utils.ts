import { ApiPayload } from '@/src/app/contexts/shared/types';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { adminDB, } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { onAdminCreateDocument, onAdminCreateAccount } from '@/src/lib/firebase/firestore/crud';
import { IInvoiceInput, IOrder } from '@/src/types/DBTypes';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 } from 'uuid';
import { generatePDFInvoice } from './generate/pdf';

export const createInvoice = async (order: IOrder, paymentId: string, receiptUrl: string | null): Promise<ApiPayload | null> => {
  try {
    const invoiceCounterRef = adminDB.collection(ENUM_COLLECTIONS.INVOICESIDS).doc('invoiceCounter');
    await invoiceCounterRef.update({
      count: FieldValue.increment(1)
    });

    const updatedDoc = await invoiceCounterRef.get();
    const updatedCount = updatedDoc.data()?.count ?? 1;

    const invoiceId = `F_${new Date().getFullYear()}-${updatedCount}`;
    const invoiceConnexionId = v4(); //  temp password to access invoices
    const date = new Date().toISOString();

    let customerId: string;

    if (order?.customerId) {
      customerId = order.customerId;
    } else {
      const newCustomer = await onAdminCreateAccount(order.customerInformations.email, invoiceConnexionId, order.customerInformations)
        .catch((error: any) => {
          // eslint-disable-next-line no-console
          console.error(`Error while creating new customer: ${error.message}`);
          return null;
        });

      if (newCustomer) {
        customerId = newCustomer;
      } else {
        customerId = order.customerInformations.email;
      }
    }
    const invoiceInput: IInvoiceInput = {
      invoiceId,
      orderId: order._id,
      customerId,
      issueDate: date,
      dueDate: date,
      amount: order.amount,
      taxes: order.taxes,
      ht: order.ht,
      status: 'paid',
      createdAt: date,
      updatedAt: date,
      lineItems: order.lineItems,
      paymentId,
      customerInformations: order.customerInformations,
      confirmMailSent: {
        status: false,
      },
      receiptUrl
    };

    const invoice = await onAdminCreateDocument(invoiceInput, ENUM_COLLECTIONS.INVOICES);
    generatePDFInvoice(invoiceInput);
    if (!invoice) {
      throw Error('Unable to create an invoice');
    }
    const pdf = `
    <html></
    `;
    // generate pdf - store - to storage
    // updateInvoice with invoiceLink
    const docRef = adminDB.collection(ENUM_COLLECTIONS.INVOICES).doc(invoice.data._id);
    return invoice;
  } catch (error: any) {
    throw Error(`Error while creating Invoice: ${error.message}`);
  }
};
