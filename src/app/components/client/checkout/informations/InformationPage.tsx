'use client';

import React, { useEffect, useMemo } from 'react';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import styled from '@emotion/styled';
import { AddAddressForm } from '@/src/app/components/account/profile/Address/AddAddressForm';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { useForm } from '@/src/app/components/hooks/useForm';
import CartSummary from '../commons/CartSummary';
import { Section } from '../../commons/layout/Section';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import AlreadyClientLink from './AlreadyClientLink';
import { useAuthSelector } from '@/src/app/contexts/auth/hooks/useAuthSelector';
import { IAddress, UserProfile } from '@/src/types/DBTypes';
import { useRouter } from 'next/navigation';
import { ENUM_ROUTES } from '@/src/app/components/navbar/routes.enums';

const CustomSection = styled(Section)`
  flex-direction: row;
  justify-content: space-around;
`;
const NameWrapper = styled(Flexbox)`
  flex-wrap: wrap;
`;

interface IInformationForm {
  email?: string;
  firstname?: string;
  lastname?: string;
  address?: IAddress;
}

const InformationIndex = () => {
  const { onInputChange, form, onDirectMutation } = useForm<IInformationForm>();
  const authProfile: UserProfile | null = useAuthSelector(
    (state) => state.profile
  );
  const router = useRouter();

  const { cart, addContactInformations } = useCart();
  const t = useTranslations();

  const selectedAddress = useMemo(() => {
    const billingAddress = authProfile?.addresses?.find(
      (address) => address.type === 'billing'
    );
    if (billingAddress) return billingAddress;

    const defaultAddress = authProfile?.addresses?.find(
      (address) => address.default
    );
    if (defaultAddress) return defaultAddress;
    const [guessedAddress] = authProfile?.addresses ?? [];
    return guessedAddress;
  }, [authProfile?.addresses]);

  const handleUpsertAddress = (address: IAddress) => {
    const useAddress = selectedAddress || address;

    onDirectMutation((prev) => ({
      ...prev,
      address: useAddress
    }));
    addContactInformations({
      ...(form as any),
      address: useAddress,
      shippingAddress: useAddress
    });

    if (cart?.items.some((item) => item.type === 'product')) {
      router.push(ENUM_ROUTES.CHECKOUT_DELIVERY);
    } else {
      router.push(ENUM_ROUTES.CHECKOUT_PAYMENT);
    }
  };

  useEffect(() => {
    const getContactInformation = {
      address: selectedAddress,
      firstname: cart?.contactInformations.firstname
        ? cart?.contactInformations.firstname
        : authProfile?.firstname ?? '',
      lastname: cart?.contactInformations.lastname
        ? cart?.contactInformations.lastname
        : authProfile?.lastname ?? '',
      email: cart?.contactInformations.email
        ? cart?.contactInformations.email
        : authProfile?.email ?? ''
    };

    onDirectMutation((prev) => ({
      ...prev,
      ...getContactInformation
    }));
  }, [authProfile, cart?.contactInformations]);

  return (
    <CustomSection>
      <Flexbox flexDirection='column' flex='1'>
        <AddAddressForm
          noDefault
          noLabel
          noType
          selectedAddress={form.address ?? null}
          onUpsertAddress={handleUpsertAddress}
          submitButton={{
            title: t('Cart.confirm')
          }}>
          <Flexbox
            style={{
              margin: '10px',
              marginLeft: '0'
            }}
            alignItems='baseline'
            justifyContent='space-between'>
            <h2>{t('Cart.billingAddress')}</h2>
            {!authProfile ? <AlreadyClientLink /> : null}
          </Flexbox>
          <InputGroup
            label={t('Contact.email')}
            id='email'
            name='email'
            type='email'
            value={form.email ?? ''}
            onChange={onInputChange}
            required
          />
          <NameWrapper flexWrap='wrap'>
            <InputGroup
              label={t('Contact.firstname')}
              id='firstname'
              name='firstname'
              value={form.firstname ?? ''}
              onChange={onInputChange}
              required
            />
            <InputGroup
              label={t('Contact.name')}
              id='lastname'
              name='lastname'
              value={form.lastname ?? ''}
              onChange={onInputChange}
              required
            />
          </NameWrapper>
        </AddAddressForm>
      </Flexbox>
      <CartSummary flexDirection='column' editable={false} />
    </CustomSection>
  );
};

export default InformationIndex;
