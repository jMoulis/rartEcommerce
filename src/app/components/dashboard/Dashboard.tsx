'use client';

import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('Dashboard');

  return <h1>{t('title')}</h1>;
}
