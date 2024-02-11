'use client';

import React, { useEffect, useMemo } from 'react';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import styled from '@emotion/styled';
import { AddAddressForm } from '@/src/app/components/account/profile/Address/AddAddressForm';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { useForm } from '@/src/app/components/hooks/useForm';
import CartSummary from '../commons/CartSummary';
import { Section } from '../../../commons/layout/Section';
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
    const shippingAddress = authProfile?.addresses?.find(
      (address) => address.type === 'shipping'
    );
    if (shippingAddress) return shippingAddress;

    const defaultAddress = authProfile?.addresses?.find(
      (address) => address.default
    );
    if (defaultAddress) return defaultAddress;
    const [guessedAddress] = authProfile?.addresses ?? [];
    return guessedAddress;
  }, [authProfile?.addresses]);

  const handleUpsertAddress = (address: IAddress) => {
    if (!selectedAddress) {
      onDirectMutation((prev) => ({
        ...prev,
        address,
      }));
      addContactInformations({
        ...(form as any),
        address,
      });
    }
    router.push(ENUM_ROUTES.CHECKOUT_DELIVERY);
  };

  useEffect(() => {
    if (cart?.contactInformations) {
      onDirectMutation((prev) => ({
        ...prev,
        ...cart.contactInformations,
      }));
    } else if (authProfile) {
      onDirectMutation((prev) => ({
        ...prev,
        address: selectedAddress,
        firstname: authProfile.firstname,
        lastname: authProfile.lastname,
        email: authProfile.email,
      }));
    }
  }, [authProfile, cart?.contactInformations]);

  return (
    <CustomSection>
      <Flexbox flexDirection='column' flex='1'>
        {/* {cart.contactInformations ? (
          <Flexbox alignItems='center'>
            <Flexbox flexDirection='column'>
              <h2>{t('Cart.shippingAddress')}</h2>
              <Flexbox>
                {cart.contactInformations.firstname}
                {cart.contactInformations.lastname}
              </Flexbox>
              {cart.contactInformations.email}
              <address>
                <span>{cart.contactInformations.address?.address}</span>
                <Flexbox>
                  <span>{cart.contactInformations.address?.postalCode}</span>
                  <span>{cart.contactInformations.address?.locality}</span>
                  <span>{cart.contactInformations.address?.country}</span>
                </Flexbox>
              </address>
            </Flexbox>
            <Flexbox>
              <Button type='button' onClick={onToggle}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </Flexbox>
          </Flexbox>
        ) : null} */}
        {/* <Collapse in={open}> */}

        <AddAddressForm
          noDefault
          noLabel
          noType
          selectedAddress={form.address ?? null}
          onUpsertAddress={handleUpsertAddress}
          submitButton={{
            title: t('Cart.confirm'),
          }}>
          <Flexbox
            style={{
              margin: '10px',
            }}
            alignItems='baseline'
            justifyContent='space-between'>
            <h2>{t('Cart.shippingAddress')}</h2>
            <AlreadyClientLink />
          </Flexbox>
          <InputGroup
            label={t('Contact.email')}
            id='email'
            name='email'
            type='email'
            value={form.email ?? ''}
            onInputChange={onInputChange}
            required
          />
          <Flexbox>
            <InputGroup
              label={t('Contact.name')}
              id='lastname'
              name='lastname'
              value={form.lastname ?? ''}
              onInputChange={onInputChange}
              required
            />
            <InputGroup
              label={t('Contact.firstname')}
              id='firstname'
              name='firstname'
              value={form.firstname ?? ''}
              onInputChange={onInputChange}
              required
            />
          </Flexbox>
        </AddAddressForm>
      </Flexbox>
      <CartSummary flexDirection='column' editable={false} />
    </CustomSection>
  );
};

export default InformationIndex;
