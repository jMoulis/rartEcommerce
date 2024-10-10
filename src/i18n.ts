import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { defaultLocale, locales } from './intl/config';
import { IntlErrorCode } from 'next-intl';

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    onError(error) {
      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
    getMessageFallback({ namespace, key, error }) {
      const path = [namespace, key].filter((part) => part != null).join('.');

      if (error.code === IntlErrorCode.MISSING_MESSAGE) {
        return path + ' is not yet translated';
      } else {
        return 'Dear developer, please fix this message: ' + path;
      }
    },
    messages: (
      await (locale === defaultLocale
        ? import(`../messages/${defaultLocale}.json`)
        : import(`../messages/${locale}.json`))
    ).default
  };
});
