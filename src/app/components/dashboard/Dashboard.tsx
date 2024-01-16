'use client';

import { useTranslations } from 'next-intl';

export default function Dashboard() {
  const t = useTranslations('Dashboard');

  return (
    <section>
      <h1>{t('title')}</h1>
    </section>
  );
}
