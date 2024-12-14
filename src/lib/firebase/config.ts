export const serverConfig = {
  useSecureCookies: process.env.USE_SECURE_COOKIES === 'true',
  firebaseApiKey: process.env.FIREBASE_API_KEY!,
  serviceAccount: {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL!,
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')!,
  }
};

export const authConfig = {
  apiKey: serverConfig.firebaseApiKey,
  cookieName: process.env.AUTH_COOKIE_NAME!,
  cookieSignatureKeys: [process.env.AUTH_COOKIE_SIGNATURE_KEY_CURRENT!, process.env.AUTH_COOKIE_SIGNATURE_KEY_PREVIOUS!],
  cookieSerializeOptions: {
    path: '/',
    httpOnly: true,
    secure: process.env.USE_SECURE_COOKIES === 'true',
    sameSite: 'lax' as const,
    maxAge: 12 * 60 * 60 * 24,
  },
  serviceAccount: serverConfig.serviceAccount,
};
