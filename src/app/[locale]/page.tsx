import { unstable_setRequestLocale } from 'next-intl/server';
import React from 'react';
import Home from '../components/client/home';
import { findByQuery } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICategory } from '@/src/types/DBTypes';

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
  const initWorkshops: any = await findByQuery(ENUM_COLLECTIONS.WORKSHOPS, {
    published: true,
  });
  const initialCategories: ICategory[] = (await findByQuery(
    ENUM_COLLECTIONS.CATEGORIES,
    {}
  )) as ICategory[];

  return (
    <Home
      initialProducts={products}
      initWorkshops={initWorkshops}
      initialCategories={initialCategories}
    />
  );
}
