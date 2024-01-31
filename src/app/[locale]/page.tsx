import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';
import Home from '../components/client/home';
import { findByQuery } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

interface Props {
  params: {
    locale: string;
  };
}

export default async function HomePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const products: any = await findByQuery(ENUM_COLLECTIONS.PRODUCTS, {
    published: true,
  });
  const initialBookings: any = await findByQuery(ENUM_COLLECTIONS.BOOKINGS, {
    published: true,
  });
  return <Home initialProducts={products} initialBookings={initialBookings} />;
}
