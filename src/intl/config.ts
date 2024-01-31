import { Pathnames } from 'next-intl/navigation';
import { ENUM_LOCALES } from './enums';

export const locales = [ENUM_LOCALES.EN, ENUM_LOCALES.FR] as const;
export const localesFlags = {
  [ENUM_LOCALES.FR]: '',
  [ENUM_LOCALES.EN]: ''
};
export const pathnames = {
  '/': '/',
  '/pathnames': {
    [ENUM_LOCALES.EN]: '/pathnames',
    [ENUM_LOCALES.FR]: '/chemins'
  }
} satisfies Pathnames<typeof locales>;

export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;

export const defaultLocale = ENUM_LOCALES.FR;
