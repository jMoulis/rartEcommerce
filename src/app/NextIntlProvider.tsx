'use client';

import { ReactNode } from 'react';
import {
  NextIntlClientProvider,
  AbstractIntlMessages,
  IntlErrorCode,
} from 'next-intl';

interface Props {
  messages: AbstractIntlMessages;
  locale: string;
  children: ReactNode;
  now: Date;
  timeZone: string;
}

export default function NextIntlProvider({
  messages,
  locale,
  children,
  now,
  timeZone,
}: Props) {
  function onError(error: any) {
    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      // Missing translations are expected and should only log an error
      console.error(error);
    }
  }
  function getMessageFallback({
    namespace,
    key,
    error,
  }: {
    namespace: string;
    key: string;
    error: any;
  }) {
    const path = [namespace, key].filter((part) => part != null).join('.');

    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      return path + ' is not yet translated';
    } else {
      return 'Dear developer, please fix this message: ' + path;
    }
  }
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      defaultTranslationValues={{
        i: (text) => <i>{text}</i>,
      }}
      onError={onError}
      getMessageFallback={getMessageFallback}
      now={now}
      timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  );
}
