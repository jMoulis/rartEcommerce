import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { IInvoiceInput } from '@/src/types/DBTypes';
import { adminDB } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { FieldValue } from 'firebase-admin/firestore';
import { onAdminCreateDocument } from '@/src/lib/firebase/firestore/crud';
import { generatePDFInvoice } from '../generate/pdf';

export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as unknown as { invoice: IInvoiceInput };
    const invoice = reqBody.invoice;

    let invoiceId = invoice.invoiceId;

    if (!invoiceId) {
      const invoiceCounterRef = adminDB.collection(ENUM_COLLECTIONS.INVOICESIDS).doc('invoiceCounter');
      await invoiceCounterRef.update({
        count: FieldValue.increment(1)
      });

      const updatedDoc = await invoiceCounterRef.get();
      const updatedCount = updatedDoc.data()?.count ?? 1;
      invoiceId = `F-${new Date().getFullYear()}-${updatedCount}`;
    }

    const date = invoice.createdAt ?? new Date().toISOString();

    const completeInvoice = {
      ...invoice,
      invoiceId,
      createdAt: date,
    };
    const newInvoice = await onAdminCreateDocument(completeInvoice, ENUM_COLLECTIONS.INVOICES);
    generatePDFInvoice({ ...completeInvoice, _id: newInvoice.data?._id }).then((pdf) => {
      const invoiceRef = adminDB.collection(ENUM_COLLECTIONS.INVOICES).doc(newInvoice.data?._id);
      invoiceRef.update({ invoiceUrl: pdf.url });
    });
    if (!invoice) {
      throw Error('Unable to create an invoice');
    }
    return NextResponse.json<APIResponse<{ _id?: string }>>({ error: null, success: true, data: { _id: newInvoice.data?._id } });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error }, {
      status: 400
    });
  }
}
