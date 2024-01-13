import 'server-only';

import { cookies } from 'next/headers';
import { initializeApp, getApps, cert, ServiceAccount } from 'firebase-admin/app';
import { SessionCookieOptions, getAuth } from 'firebase-admin/auth';

const serviceAccount: ServiceAccount = {
  projectId: process.env.NEXT_GOOGLE_PROJECT_ID,
  privateKey: process.env.NEXT_GOOGLE_PRIVATE_KEY,
  clientEmail: process.env.NEXT_GOOGLE_CLIENT_EMAIL,
};

export const firebaseApp =
  getApps().find((it) => it.name === 'firebase-admin-app') ??
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    'firebase-admin-app'
  );

export const auth = getAuth(firebaseApp);

async function getSession() {
  try {
    return cookies().get('__session')?.value;
  } catch (error) {
    return undefined;
  }
}

export async function isUserAuthenticated(session: string | undefined = undefined) {
  const _session = session ?? (await getSession());
  if (!_session) return false;

  try {
    const isRevoked = !(await auth.verifySessionCookie(_session, true));
    return !isRevoked;
  } catch (error) {
    return false;
  }
}

export async function getCurrentUser() {
  const session = await getSession();

  if (!(await isUserAuthenticated(session))) {
    return null;
  }
  if (!session) return null;
  const decodedIdToken = await auth.verifySessionCookie(session);
  const currentUser = await auth.getUser(decodedIdToken.uid);
  return JSON.parse(JSON.stringify(currentUser));
}

export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
  return await auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  await auth.revokeRefreshTokens(decodedIdToken.sub);
}
