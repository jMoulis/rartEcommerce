import createMiddleware from 'next-intl/middleware';
import { pathnames, locales, localePrefix, defaultLocale } from './intl/config';
import { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const handleI18nRouting = createMiddleware({
    defaultLocale,
    locales,
    pathnames,
    localePrefix
  });
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ['/', '/(en|fr)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
