'use client';

import React, { ChangeEvent } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';
import CartSummary from '../commons/CartSummary';
import { Section } from '../../commons/layout/Section';
import { CallToAction } from '../../../commons/Buttons/CallToAction';
import { AddAddressForm } from '../../../account/profile/Address/AddAddressForm';
import { InputGroupCheckbox } from '../../../commons/form/InputCheckbox';
import { Flexbox } from '../../../commons/Flexbox';
import { IAddress } from '@/src/types/DBTypes';
import { ShippingInformation } from '../commons/ShippingInformation';
import { CheckoutHeader } from '../CheckoutHeader';

export const Delivery = () => {
  const { cart, addContactInformations } = useCart();
  const [isSame, setIsIsSame] = React.useState(true);

  const handleUpsertAddress = async (address: IAddress) => {
    if (!cart?.contactInformations.address) return;
    addContactInformations({
      ...(cart.contactInformations as any),
      shippingAddress: address,
    });
  };

  const handleSelectSame = (event: ChangeEvent<HTMLInputElement>) => {
    setIsIsSame(event?.currentTarget.checked);
    if (cart) {
      if (event?.currentTarget.checked) {
        addContactInformations({
          ...(cart.contactInformations as any),
          shippingAddress: cart.contactInformations.address,
        });
      } else {
        addContactInformations({
          ...(cart.contactInformations as any),
          shippingAddress: null,
        });
      }
    }
  };
  const t = useTranslations();

  if (!cart) return null;

  return (
    <>
      <CheckoutHeader />
      <Section>
        <Flexbox flexDirection='column'>
          <InputGroupCheckbox
            id='same-address'
            onInputChange={handleSelectSame}
            name='same'
            value={isSame}
            label={t('Cart.sameAsBilling')}
          />
          <ShippingInformation />
          {!isSame ? (
            <AddAddressForm
              noDefault
              noLabel
              noType
              selectedAddress={null}
              onUpsertAddress={handleUpsertAddress}
              submitButton={{
                title: t('Cart.confirm'),
              }}
            />
          ) : null}
        </Flexbox>
        <CartSummary
          editable={false}
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
                label: t('Cart.validateShipping'),
                href: ENUM_ROUTES.CHECKOUT_PAYMENT,
              }}
            />
          }
        />
      </Section>
    </>
  );
};
