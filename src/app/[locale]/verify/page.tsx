import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';
import Verify from '../../components/verify';

interface Props {
  params: {
    locale: string;
  };
}

export default async function VerifyPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return <Verify />;
}
