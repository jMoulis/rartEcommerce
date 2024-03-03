'use client';

import { IAddress } from '@/src/types/DBTypes';
import React, { useCallback, useEffect, useState } from 'react';
import { AddressItem } from './AddressItem';
import { AddAddressForm } from './AddAddressForm';
import { useTranslations } from 'next-intl';
import { useToggle } from '../../../hooks/useToggle';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Button } from '../../../commons/Buttons/Button';
import { useFirestoreProfile } from '@/src/app/contexts/auth/hooks/useFirestoreProfile';
import styled from '@emotion/styled';
import { FullDialog } from '../../../commons/dialog/FullDialog';

const Root = styled.main``;
const List = styled.ul``;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
`;
const Content = styled.div``;

interface Props {
  prevAddresses: IAddress[];
  onUpdate: (updatedAddresses: IAddress[]) => void;
}

export const AddressForm = ({ prevAddresses, onUpdate }: Props) => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);
  const { onUpdateAddress } = useFirestoreProfile();
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
          prev._id === newAddress._id ? newAddress : prev
        );
      } else {
        updatedAddresses = [...updatedAddresses, newAddress];
      }
      setAddresses(updatedAddresses);
      onUpdate(updatedAddresses);

      handleCloseDialog();
    },
    [addresses]
  );

  const handleDeleteAddress = async (addressId: string) => {
    const updatedAddresses = prevAddresses.filter(
      (prevAddress) => prevAddress._id !== addressId
    );
    setAddresses(updatedAddresses);
    await onUpdateAddress(
      { addresses: updatedAddresses },
      ENUM_COLLECTIONS.PROFILES
    );
    handleCloseDialog();
  };

  const handleSelectAddress = (addressId?: string) => {
    const foundAddress = addresses.find((prev) => prev._id === addressId);
    setSelectedAddress(foundAddress ?? null);
    onOpen();
  };

  return (
    <Root>
      <Header>
        <Button type='button' onClick={onOpen}>
          {t('commons.add')}
        </Button>
      </Header>
      <Content>
        <List>
          {addresses.map((address, key) => (
            <li key={key}>
              <AddressItem
                address={address}
                onSelectAddress={handleSelectAddress}
              />
            </li>
          ))}
        </List>
      </Content>
      <FullDialog
        dialog={{
          fullWidth: true,
          maxWidth: 'sm',
        }}
        header={{
          title: t('AddressForm.newAddress'),
        }}
        open={open}
        onClose={handleCloseDialog}>
        <AddAddressForm
          selectedAddress={selectedAddress}
          onUpsertAddress={handleUpsertAddress}
          onDeleteAddress={handleDeleteAddress}
          onCancel={handleCloseDialog}
        />
      </FullDialog>
    </Root>
  );
};
