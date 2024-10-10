import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { APIResponse } from '@/src/types/types';
import { revokeAllSessions } from '@/src/lib/firebase/firebaseAuth/firebase-admin';

export async function GET() {
  const sessionCookie = cookies().get('__session')?.value;

  if (!sessionCookie) { return NextResponse.json<APIResponse<string>>({ error: null, success: true, data: '' }, { status: 200 }); }

  cookies().delete('__session');

  await revokeAllSessions(sessionCookie);

  return NextResponse.json<APIResponse<string>>({ error: null, success: true, data: 'Signed out successfully.' });
}
