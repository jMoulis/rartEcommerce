import React from 'react';
import {
  onCreateDocument,
  onUpdateDocument,
} from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IAddress } from '@/src/types/DBTypes';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { AddAddressForm } from '../../../account/profile/Address/AddAddressForm';
import { useTranslations } from 'next-intl';

interface Props {
  open: boolean;
  onClose: VoidFunction;
  onSelectLocation: (locationId: string) => void;
  editedLocation?: IAddress | null;
}

export const LocationForm = ({
  onSelectLocation,
  open,
  onClose,
  editedLocation,
}: Props) => {
  const t = useTranslations();

  const handleUpsertLocation = async (address: IAddress) => {
    if (editedLocation?._id) {
      await onUpdateDocument(
        address,
        ENUM_COLLECTIONS.LOCATIONS,
        editedLocation._id
      );
      onSelectLocation(editedLocation._id);
    } else {
      const payload = await onCreateDocument(
        address,
        ENUM_COLLECTIONS.LOCATIONS
      );
      if (payload.data?._id) {
        onSelectLocation(payload.data._id);
      }
    }
    onClose();
  };

  return (
    <FullDialog
      open={open}
      onClose={onClose}
      dialog={{
        fullWidth: true,
        maxWidth: 'lg',
      }}
      styling={{
        content: {
          height: '20vh',
          minHeight: '20vh',
          backgroundColor: 'var(--background-section-color)',
        },
      }}
      header={{
        title: t('AddressForm.newAddress'),
      }}>
      {open ? (
        <AddAddressForm
          selectedAddress={editedLocation ?? null}
          onDeleteAddress={() => {}}
          onUpsertAddress={handleUpsertLocation}
          onCancel={onClose}
          noType
          noDefault
        />
      ) : null}
    </FullDialog>
  );
};
