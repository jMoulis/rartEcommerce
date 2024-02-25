import { NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { IShippingContract } from '@/src/types/DBTypes';

export async function GET() {
  try {
    const payload = {
      method: 'GET',
      headers: {
        Authorization: `Basic ${Buffer.from('d85a2cdc-e783-459c-aeac-65d2ea263da0:5c8e368ec73e4bb4964094a12fa70a04', 'utf-8').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch('https://panel.sendcloud.sc/api/v2/contracts', payload).then(async (payload) => payload.json()).then((data) => data?.contracts || []) as IShippingContract[];

    const carriers = response.reduce((acc: Record<string, string[]>, contract) => {
      if (!acc[contract.carrier.name]) {
        return {
          ...acc,
          [contract.carrier.name]: [contract.id]
        };
      }
      return {
        ...acc,
        [contract.carrier.name]: [...acc[contract.carrier.name], contract.id]
      };
    }, {});

    return NextResponse.json<APIResponse<Record<string, string[]>>>({ status: 200, error: null, success: true, data: carriers });
  } catch (error: any) {
    return NextResponse.json<APIResponse<string>>({ status: 400, error: error.message, success: false, data: null });
  }
}
