import { unstable_setRequestLocale } from 'next-intl/server';
import React, { Suspense } from 'react';
import Verify from '../../components/verify';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}

export default async function VerifyPage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  unstable_setRequestLocale(locale);
  return (
    <Suspense fallback={<span />}>
      <Verify />
    </Suspense>
  );
}
