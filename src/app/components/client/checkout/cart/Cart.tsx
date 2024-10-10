'use client';

import CartSummary from '../commons/CartSummary';
import { useTranslations } from 'next-intl';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import CartList from './CartList';
import { CallToAction } from '../../../commons/Buttons/CallToAction';
import SectionHeader from '../../home/SectionHeader';
import { Section } from '../../commons/layout/Section';
import { Breadcrumb } from '../commons/Breadcrumb';
import styled from '@emotion/styled';
import { Page } from '../../commons/layout/Page';

const CustomSection = styled(Section)`
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export default function Cart() {
  const t = useTranslations();

  return (
    <Page>
      <SectionHeader
        backgroundImage='/images/home/image1.jpeg'
        title={t('Cart.basket')}
        description="Découvrez l’univers merveilleux de l'artisanat créatif avec RartCreation!"
      />
      <Breadcrumb />
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
