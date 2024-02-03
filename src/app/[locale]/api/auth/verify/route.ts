import { NextRequest, NextResponse } from 'next/server';
import { APIResponse } from '@/src/types/types';
import { onRootFindByQuery, onRootUpdateDocument } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { UserProfile } from '@/src/types/DBTypes';

export async function POST(request: NextRequest) {
  const reqBody = (await request.json()) as { token: string, email: string };
  const token = reqBody.token;
  const email = reqBody.email;
  try {
    const user = await onRootFindByQuery(ENUM_COLLECTIONS.PROFILES, {
      email
    }) as UserProfile;

    if (!user) return NextResponse.json<APIResponse<string>>({ status: 500, error: 'No user', success: false, data: null });

    if (user.verificationDate) {
      return NextResponse.json<APIResponse<UserProfile>>({ status: 200, error: null, success: true, data: user });
    }
    if (user.token !== token) {
      return NextResponse.json<APIResponse<string>>({ status: 500, error: 'invalid token', success: false, data: null });
    }
    const updatedResponse = await onRootUpdateDocument({ token: null, verified: true, verificationDate: new Date() }, ENUM_COLLECTIONS.PROFILES, user._id);
    if (updatedResponse.status) {
      return NextResponse.json<APIResponse<UserProfile>>({ status: 200, error: null, success: true, data: user });
    } else {
      throw Error(updatedResponse.error!);
    }
  } catch (error: any) {
    return NextResponse.json<APIResponse<string>>({ status: 500, error: error.message, success: false, data: null });
  }
}
