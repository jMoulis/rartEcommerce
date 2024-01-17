import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';

interface Props {
  params: {
    locale: string;
  };
}
export default async function HomePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return <span>HEllo</span>;
}
