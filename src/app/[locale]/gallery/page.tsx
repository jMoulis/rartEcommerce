import React from 'react';
import GalleryPage from '../../components/client/gallery';
import { findByQuery } from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { unstable_setRequestLocale } from 'next-intl/server';
import { ICategory } from '@/src/types/DBTypes';

interface Props {
  params: Promise<{
    locale: string;
  }>;
}
export default async function HomePage(props: Props) {
  const params = await props.params;

  const {
    locale
  } = params;

  unstable_setRequestLocale(locale);
  const initialArtworks: any = await findByQuery(ENUM_COLLECTIONS.ARTWORKS, {
    published: true,
  });
  const initialCategories: ICategory[] = (await findByQuery(
    ENUM_COLLECTIONS.CATEGORIES,
    {}
  )) as ICategory[];
  return (
    <GalleryPage
      initialArtworks={initialArtworks}
      initialCategories={initialCategories}
    />
  );
}
