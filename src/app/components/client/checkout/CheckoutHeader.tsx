import { useTranslations } from 'next-intl';
import React from 'react';
import SectionHeader from '../home/SectionHeader';
import { Breadcrumb } from './commons/Breadcrumb';

export const CheckoutHeader = () => {
  const t = useTranslations();

  return (
    <>
      <SectionHeader
        backgroundImage='/images/home/image1.jpeg'
        title={t('Cart.basket')}
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!"
      />
      <Breadcrumb />
    </>
  );
};
