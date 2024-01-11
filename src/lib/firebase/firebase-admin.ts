import "server-only";

import { cookies } from "next/headers";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { SessionCookieOptions, getAuth } from "firebase-admin/auth";

const serviceAccount: any = {
  project_id: process.env.NEXT_GOOGLE_PROJECT_ID,
  private_key_id: process.env.NEXT_GOOGLE_PROJECT_KEY_ID,
  private_key: process.env.NEXT_GOOGLE_PRIVATE_KEY,
  client_email: process.env.NEXT_GOOGLE_CLIENT_EMAIL,
  client_id: process.env.NEXT_GOOGLE_CLIENT_ID,
  auth_uri: process.env.NEXT_GOOGLE_AUTH_URI,
  token_uri: process.env.NEXT_GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NEXT_GOOGLE_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.NEXT_GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.NEXT_GOOGLE_UNIVERSE
};

export const firebaseApp =
  getApps().find((it) => it.name === "firebase-admin-app") ||
  initializeApp(
    {
      credential: cert(serviceAccount),
    },
    "firebase-admin-app"
  );

export const auth = getAuth(firebaseApp);

async function getSession() {
  try {
    return cookies().get("__session")?.value;
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
  const decodedIdToken = await auth.verifySessionCookie(session!);
  const currentUser = await auth.getUser(decodedIdToken.uid);
  return JSON.parse(JSON.stringify(currentUser));
}


export async function createSessionCookie(idToken: string, sessionCookieOptions: SessionCookieOptions) {
  return auth.createSessionCookie(idToken, sessionCookieOptions);
}

export async function revokeAllSessions(session: string) {
  const decodedIdToken = await auth.verifySessionCookie(session);

  return await auth.revokeRefreshTokens(decodedIdToken.sub);
}