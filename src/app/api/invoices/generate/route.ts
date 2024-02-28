import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { IInvoiceInput } from '@/src/types/DBTypes';
import { generatePDFInvoice } from './pdf';

export async function POST(request: NextRequest) {
  try {
    const invoice = (await request.json()) as IInvoiceInput;
    const pdf = generatePDFInvoice(invoice);
    return NextResponse.json<APIResponse<string>>({ error: null, success: true, data: null });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error }, {
      status: 400
    });
  }
}
