import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';
import { useTranslations } from 'next-intl';
import React from 'react';
import { CallToAction } from '../../../commons/Buttons/CallToAction';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import { Section } from '../../commons/layout/Section';

const Title = styled.h2`
  text-align: center;
  font-size: 25px;
  margin: 20px 0;
`;
const Description = styled.p`
  text-align: center;
  font-size: 20px;
`;

export const EmptyCart = () => {
  const t = useTranslations();
  return (
    <Section
      style={{
        flex: 1,
        justifyContent: 'flex-start',
      }}>
      <Title>{t('Cart.emptyCart')}</Title>
      <Description>{t('Cart.emptyCartEngagingMessage')}</Description>
      <Flexbox flexWrap='wrap'>
        <CallToAction
          styling={{
            margin: '0 5px',
          }}
          active={false}
          color='#fff'
          backgroundColor='var(--secondary-color)'
          hoverBackgroundColor='var(--secondary-accent)'
          route={{
            label: t('commons.workshop'),
            href: ENUM_ROUTES.WORKSHOPS,
          }}
        />
        <CallToAction
          active={false}
          color='#fff'
          styling={{
            margin: '0 5px',
          }}
          backgroundColor='var(--primary-color)'
          hoverBackgroundColor='var(--primary-accent)'
          route={{
            label: t('commons.store'),
            href: ENUM_ROUTES.PRODUCTS,
          }}
        />
      </Flexbox>
    </Section>
  );
};
