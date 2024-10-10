'use client';

import { useCart } from '@/src/app/contexts/cart/CartContext';
import React, { useEffect } from 'react';
import { SectionPage } from '../../../commons/Layouts/SectionPage';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import SectionHeader from '../../home/SectionHeader';
import { CallToAction } from '../../../commons/Buttons/CallToAction';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';

const ConfirmationMessage = styled.p`
  font-size: 20px;
  max-width: 500px;
  text-align: justify;
  margin-top: 30px;
`;

const Success = () => {
  const { clearCart } = useCart();
  const t = useTranslations();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <>
      <SectionHeader
        backgroundImage='/images/home/background.jpeg'
        title={t('Checkout.congrat')}
        description=" Merci d'avoir ajouté une touche d'art à votre espace"></SectionHeader>
      <SectionPage>
        <Flexbox
          alignItems='center'
          flexDirection='column'
          justifyContent='center'>
          <ConfirmationMessage>
            Votre paiement a été accepté et nous préparons votre commande avec
            l'enthousiasme d'un artiste en plein travail.
            <br />
            Restez à l'écoute pour un email de suivi très spécial !
          </ConfirmationMessage>
          <CallToAction
            active={false}
            styling={{ marginTop: '30px' }}
            color='white'
            backgroundColor='var(--primary-color)'
            hoverBackgroundColor='var(--primary-accent)'
            route={{
              label: t('Navbar.home'),
              href: ENUM_ROUTES.HOME,
            }}
          />
        </Flexbox>
      </SectionPage>
    </>
  );
};

export default Success;
