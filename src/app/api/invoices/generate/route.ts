import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { IInvoice } from '@/src/types/DBTypes';
import { generatePDFInvoice } from './pdf';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { adminDB } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
// import { MailService } from '@/src/lib/mailService/MailService';

export async function POST(request: NextRequest) {
  try {
    const invoice = (await request.json()) as IInvoice;
    const pdf = await generatePDFInvoice(invoice);
    const invoiceRef = adminDB.collection(ENUM_COLLECTIONS.INVOICES).doc(invoice._id);
    invoiceRef.set({
      invoiceUrl: pdf?.url ?? null
    }, { merge: true });
    // const mailService = new MailService();

    // const mailResponse = await mailService.sendEmail({
    //   files: pdf ? [pdf] : [],
    //   email: 'julien.moulis@moulis.me',
    //   subject: 'Confirmation de paiement',
    //   template: {
    //     name: 'paymentSuccess',
    //     props: {
    //       customer: 'Julien',
    //       host: 'localhost:3000',
    //       contactName: process.env.NEXT_CONTACT_NAME,
    //       companyName: process.env.NEXT_COMPANY_NAME,
    //       mailSystem: process.env.NEXT_PUBLIC_MAIL_SYSTEM,
    //       // receiptUrl: data.receipt_url,
    //     }
    //   }
    // });
    return NextResponse.json<APIResponse<{ url?: string }>>({ error: null, success: true, data: { url: pdf.url } });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error }, {
      status: 400
    });
  }
}
