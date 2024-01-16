'use client';

import { IAddress } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  address: IAddress;
  onSelectAddress: (addressId: string) => void;
}

export const AddressItem = ({ address, onSelectAddress }: Props) => {
  const tAddress = useTranslations('AddressForm');
  const tCommons = useTranslations('commons');

  return (
    <>
      <address>
        <p>
          {tAddress('name')}
          {address.name}
        </p>
        <p>
          {tAddress('streetNumber')}
          {address.streetNumber}
        </p>
        <p>
          {tAddress('route')}
          {address.route}
        </p>
        <p>
          {tAddress('postalCode')}
          {address.postalCode}
        </p>
        <p>
          {tAddress('locality')}
          {address.locality}
        </p>
        <p>
          {tAddress('country')}
          {address.country}
        </p>
        <p>
          {tAddress('default')}
          {address.default}
        </p>
        <p>
          {tAddress('addressType')}
          {address.type}
        </p>
      </address>
      <button type='button' onClick={() => onSelectAddress(address.id)}>
        {tCommons('edit')}
      </button>
    </>
  );
};
