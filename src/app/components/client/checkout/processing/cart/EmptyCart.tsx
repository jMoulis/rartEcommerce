import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

interface Props {}

export const EmptyCart = (props: Props) => {
  const t = useTranslations();
  return (
    <div>
      EmptyCart
      <Link href={ENUM_ROUTES.PRODUCTS}>{t('commons.store')}</Link>
      <Link href={ENUM_ROUTES.WORKSHOPS}>{t('commons.workshop')}</Link>
    </div>
  );
};
