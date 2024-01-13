import createMiddleware from 'next-intl/middleware';
import { pathnames, locales, localePrefix, defaultLocale } from './intl/config';

export default createMiddleware({
  defaultLocale,
  locales,
  pathnames,
  localePrefix
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(en|fr)/:path*', '/((?!_next|_vercel|.*\\..*).*)']
};
