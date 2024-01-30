import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { IOccurence, IRepetition } from '@/src/types/DBTypes';
import { formatDateInfo, generateOccurrences } from './utils';

export async function POST(request: NextRequest) {
  try {
    const reqBody = (await request.json()) as unknown as IRepetition;
    const occurrences = generateOccurrences(reqBody.start, reqBody.interval, reqBody.end, reqBody.days, reqBody.frequency);
    const formattedOccurences = occurrences.map(formatDateInfo);

    return NextResponse.json<APIResponse<IOccurence[]>>({ error: null, success: true, data: formattedOccurences });
  } catch (error: any) {
    return NextResponse.json<APIResponse<Date[]>>({ success: false, data: null, error }, {
      status: 400
    });
  }
}
