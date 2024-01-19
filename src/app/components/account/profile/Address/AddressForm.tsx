'use client';

import { IAddress } from '@/src/types/DBTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { AddressItem } from './AddressItem';
import { AddAddressForm } from './AddAddressForm';
import { useTranslations } from 'next-intl';
import { Dialog } from '@mui/material';
import { useToggle } from '../../../hooks/useToggle';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Button } from '../../../commons/Buttons/Button';
import { useFirestorProfile } from '@/src/app/contexts/auth/hooks/useFirestoreProfile';

interface Props {
  prevAddresses: IAddress[];
}

export const AddressForm = ({ prevAddresses }: Props) => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const { onUpdateAddress } = useFirestorProfile();
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();

  useEffect(() => {
    setAddresses(prevAddresses);
  }, [prevAddresses]);

  const handleCloseDialog = () => {
    onClose();
    setSelectedAddress(null);
  };

  const handleUpsertAddress = useCallback(
    async (newAddress: IAddress, edit?: boolean) => {
      let updatedAddresses = [...addresses];

      if (edit) {
        updatedAddresses = updatedAddresses.map((prev) =>
          prev.id === newAddress.id ? newAddress : prev
        );
      } else {
        updatedAddresses = [...updatedAddresses, newAddress];
      }
      setAddresses(updatedAddresses);

      await onUpdateAddress(
        { addresses: updatedAddresses },
        ENUM_COLLECTIONS.PROFILES
      );

      handleCloseDialog();
    },
    [addresses]
  );

  const handleDeleteAddress = async (addressId: string) => {
    const updatedAddresses = prevAddresses.filter(
      (prevAddress) => prevAddress.id !== addressId
    );
    setAddresses(updatedAddresses);
    await onUpdateAddress(
      { addresses: updatedAddresses },
      ENUM_COLLECTIONS.PROFILES
    );
    handleCloseDialog();
  };

  const handleSelectAddress = (addressId: string) => {
    const foundAddress = addresses.find((prev) => prev.id === addressId);
    setSelectedAddress(foundAddress ?? null);
    onOpen();
  };

  return (
    <div>
      <ul>
        {addresses.map((address, key) => (
          <li key={key}>
            <AddressItem
              address={address}
              onSelectAddress={handleSelectAddress}
            />
          </li>
        ))}
      </ul>
      <Button type='button' onClick={onOpen}>
        {t('commons.create')}
      </Button>
      <Dialog open={open} onClose={handleCloseDialog} keepMounted={false}>
        <AddAddressForm
          selectedAddress={selectedAddress}
          onUpsertAddress={handleUpsertAddress}
          onDeleteAddress={handleDeleteAddress}
          onCancel={handleCloseDialog}
        />
      </Dialog>
    </div>
  );
};
