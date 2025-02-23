'use client';

import React, { ChangeEvent, useEffect } from 'react';
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
import DeliverySelector from './DeliverySelector';

export const Delivery = () => {
  const { cart, addContactInformations } = useCart();
  const [isSame, setIsIsSame] = React.useState(true);
  const [hiddenAddressForm, setHiddenAddressForm] = React.useState(false);

  const handleUpsertAddress = async (address: IAddress) => {
    if (!cart?.contactInformations.address) return;
    addContactInformations({
      ...(cart.contactInformations as any),
      shippingAddress: address
    });
    setHiddenAddressForm(true);
  };

  const handleSelectSame = (event: ChangeEvent<HTMLInputElement>) => {
    setIsIsSame(event?.currentTarget.checked);
    if (!event?.currentTarget.checked) {
      setHiddenAddressForm(false);
    }
    if (cart) {
      if (event?.currentTarget.checked) {
        addContactInformations({
          ...(cart.contactInformations as any),
          shippingAddress: cart.contactInformations.address
        });
      } else {
        // addContactInformations({
        //   ...(cart.contactInformations as any),
        //   shippingAddress: null
        // });
      }
    }
  };
  useEffect(() => {
    if (isSame && cart?.contactInformations.address) {
      addContactInformations({
        ...(cart.contactInformations as any),
        shippingAddress: cart.contactInformations.address
      });
    }
  }, [cart?.contactInformations?.address, isSame]);

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
          <ShippingInformation
            onEditAddress={() => setHiddenAddressForm(false)}
          />
          {!isSame && !hiddenAddressForm ? (
            <AddAddressForm
              noDefault
              noLabel
              noType
              selectedAddress={cart.contactInformations.shippingAddress ?? null}
              onUpsertAddress={handleUpsertAddress}
              submitButton={{
                title: t('Cart.confirm')
              }}
              onCancel={() => setHiddenAddressForm(true)}
            />
          ) : null}
          <DeliverySelector />
        </Flexbox>
        <CartSummary
          editable={false}
          Action={
            <CallToAction
              styling={{
                padding: '10px 20px',
                margin: 0,
                flex: 1,
                justifyContent: 'center'
              }}
              active={false}
              color='#fff'
              backgroundColor='var(--primary-color)'
              hoverBackgroundColor='var(--primary-accent)'
              route={{
                label: t('Cart.validateShipping'),
                href: ENUM_ROUTES.CHECKOUT_PAYMENT
              }}
            />
          }
        />
      </Section>
    </>
  );
};
