import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { ICart } from '@/src/types/DBTypes';
import { createOrder } from '../utils';

export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as unknown as { cart: ICart, connectedCustomerId?: string };
    const payload = await createOrder(reqBody.cart, reqBody.connectedCustomerId);
    return NextResponse.json<APIResponse<string>>({ error: null, success: true, data: payload?.data?._id });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error }, {
      status: 400
    });
  }
}
