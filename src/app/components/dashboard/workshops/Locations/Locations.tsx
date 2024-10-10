import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useToggle } from '../../../hooks/useToggle';
import { LocationsTable } from './LocationsTable';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { IAddress } from '@/src/types/DBTypes';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { SelectedLocation } from '../SelectedLocation';
import { useTranslations } from 'next-intl';

const Root = styled.div``;

interface Props {
  locationId?: string | null;
  onSelectLocation: (locationId: string) => void;
  onDeleteLocation: () => void;
}

export const Locations = ({ locationId, onSelectLocation }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const [locations, setLocations] = useState<IAddress[]>([]);
  const t = useTranslations();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.LOCATIONS,
      (data) => {
        setLocations(data);
      },
      (_error) => {}
    );
    return () => {
      unsubscribe?.();
    };
  }, []);

  const selectedLocation = useMemo(
    () => locations.find((prev) => prev._id === locationId),
    [locationId, locations]
  );

  const handleSelect = (addressId: string) => {
    onSelectLocation(addressId);
    onClose();
  };

  return (
    <Root>
      <SelectedLocation onOpen={onOpen} location={selectedLocation} />
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
          },
        }}
        header={{
          title: t('Booking.locations'),
        }}>
        {open ? (
          <LocationsTable
            locations={locations}
            onSelectLocation={handleSelect}
          />
        ) : null}
      </FullDialog>
    </Root>
  );
};
