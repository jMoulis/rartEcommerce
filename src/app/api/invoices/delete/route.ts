import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json<APIResponse<string>>({ error: null, success: true, data: null });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error }, {
      status: 400
    });
  }
}
