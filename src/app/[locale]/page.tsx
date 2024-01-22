import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';
import { Page } from '@/src/app/components/commons/Layouts/Page';

interface Props {
  params: {
    locale: string;
  };
}
export default async function HomePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return <Page>HEllo</Page>;
}
