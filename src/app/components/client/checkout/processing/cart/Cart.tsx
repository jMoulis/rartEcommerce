'use client';

import { SectionPage } from '../../../../commons/Layouts/SectionPage';

import CartSummary from '../commons/CartSummary';
import { useTranslations } from 'next-intl';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import { ButtonLink } from '../commons/ButtonLink';

export default function Cart() {
  const t = useTranslations();

  return (
    <SectionPage
      style={{
        flexDirection: 'row',
      }}>
      <CartSummary
        Action={
          <ButtonLink href={ENUM_ROUTES.CHECKOUT_INFORMATIONS}>
            {t('Cart.checkout')}
          </ButtonLink>
        }
        editable
      />
    </SectionPage>
  );
}
