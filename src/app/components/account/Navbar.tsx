'user client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  const t = useTranslations();
  return (
    <div>
      <h1>{t('Navbar.account')}</h1>
      <Link href='/account/personal-info'>{t('Navbar.personalInfo')}</Link>
      <Link href='/account/orders'>{t('Navbar.orders')}</Link>
    </div>
  );
};

export default Navbar;
