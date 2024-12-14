import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';

export default async function middleware(request: NextRequest) {
  const intlMiddleware = createMiddleware(routing);
  const response = intlMiddleware(request);
  return response;
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};
// export const config = {
//   matcher: ['/', '/(en|fr)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
// };
