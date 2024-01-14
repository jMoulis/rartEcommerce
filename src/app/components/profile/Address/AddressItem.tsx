'use client';

import { IAddress } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  address: IAddress;
  onDeleteAddress: (addressId: string) => void;
  onSelectAddress: (addressId: string) => void;
}

export const AddressItem = ({
  address,
  onSelectAddress,
  onDeleteAddress,
}: Props) => {
  const t = useTranslations('commons');

  return (
    <address onClick={() => onSelectAddress(address.id)}>
      <p>{address.name}</p>
      <p>{address.streetNumber}</p>
      <p>{address.route}</p>
      <p>{address.postalCode}</p>
      <p>{address.locality}</p>
      <p>{address.country}</p>
      <p>{address.default}</p>
      <p>{address.type}</p>
      <button type='button' onClick={() => onDeleteAddress(address.id)}>
        {t('delete')}
      </button>
    </address>
  );
};
