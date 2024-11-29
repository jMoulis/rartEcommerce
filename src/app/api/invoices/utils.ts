import { ApiPayload } from '@/src/app/contexts/shared/types';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { adminDB } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { onAdminCreateDocument, onAdminCreateAccount } from '@/src/lib/firebase/firestore/crud';
import { IInvoiceInput, IOrder } from '@/src/types/DBTypes';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 } from 'uuid';
import { generatePDFInvoice } from './generate/pdf';
// import { generatePDFInvoice } from './generate/pdf';

export const createInvoice = async (order: IOrder, paymentId: string, receiptUrl: string | null): Promise<{ invoice: ApiPayload, pdf: { content: Buffer, filename: string; contentType: string, url: string } | null } | null> => {
  try {
    const invoiceCounterRef = adminDB.collection(ENUM_COLLECTIONS.INVOICESIDS).doc('invoiceCounter');
    await invoiceCounterRef.update({
      count: FieldValue.increment(1)
    });

    const updatedDoc = await invoiceCounterRef.get();
    const updatedCount = updatedDoc.data()?.count ?? 1;

    const invoiceId = `F-${new Date().getFullYear()}-${updatedCount}`;
    const invoiceConnexionId = v4(); //  temp password to access invoices
    const date = new Date().toISOString();

    let customerId: string;

    if (order?.customerId) {
      customerId = order.customerId;
    } else {
      const newCustomerAuth = await onAdminCreateAccount(order.customerInformations.email, invoiceConnexionId, order.customerInformations)
        .catch((error: any) => {
          // eslint-disable-next-line no-console
          console.error(`Error while creating new customer: ${error.message}`);
          return null;
        });

      if (newCustomerAuth) {
        customerId = newCustomerAuth;
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

    const pdf = await generatePDFInvoice({ ...invoiceInput, _id: invoice.data?._id }, false);

    if (!invoice) {
      throw Error('Unable to create an invoice');
    }
    return { invoice, pdf };
  } catch (error: any) {
    throw Error(`Error while creating Invoice: ${error.message}`);
  }
};
