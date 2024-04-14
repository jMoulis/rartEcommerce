'use client';

import CartSummary from '../commons/CartSummary';
import { useTranslations } from 'next-intl';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import CartList from './CartList';
import { CallToAction } from '../../../commons/Buttons/CallToAction';
import { Section } from '../../commons/layout/Section';
import styled from '@emotion/styled';
import { CheckoutHeader } from '../CheckoutHeader';
import { Page } from '../../commons/layout/Page';

const CustomSection = styled(Section)`
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default function CartPage() {
  const t = useTranslations();

  return (
    <Page>
      <CheckoutHeader />
      <CustomSection>
        <CartList />
        <CartSummary
          Action={
            <CallToAction
              styling={{
                padding: '10px 20px',
                margin: 0,
                flex: 1,
                justifyContent: 'center',
              }}
              active={false}
              color='#fff'
              backgroundColor='var(--primary-color)'
              hoverBackgroundColor='var(--primary-accent)'
              route={{
                label: t('Cart.checkout'),
                href: ENUM_ROUTES.CHECKOUT_INFORMATIONS,
              }}
            />
          }
          editable
        />
      </CustomSection>
    </Page>
  );
}
