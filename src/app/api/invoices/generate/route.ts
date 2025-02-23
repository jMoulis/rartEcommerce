import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { IInvoice } from '@/src/types/DBTypes';
import { generatePDFInvoice } from './pdf';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { adminDB } from '@/src/lib/firebase/firebaseAuth/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { invoice, estimate } = (await request.json()) as { invoice: IInvoice, estimate?: boolean };
    const pdf = await generatePDFInvoice(invoice, estimate ?? false, false);
    const collection = estimate ? ENUM_COLLECTIONS.ESTIMATES : ENUM_COLLECTIONS.INVOICES;
    const invoiceRef = adminDB.collection(collection).doc(invoice._id);
    invoiceRef.set({
      invoiceUrl: pdf?.url ?? null
    }, { merge: true });
    return NextResponse.json<APIResponse<{ url?: string }>>({ error: null, success: true, data: { url: pdf.url } });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error: error.message }, {
      status: 400
    });
  }
}
