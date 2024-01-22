import React, { useState } from 'react';
import styled from '@emotion/styled';
import { IAddress } from '@/src/types/DBTypes';
import { Button } from '../../../commons/Buttons/Button';
import { useTranslations } from 'next-intl';
import { useToggle } from '../../../hooks/useToggle';
import { Table } from '../../../commons/Table/Table';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { LocationForm } from './LocationForm';
import { Flexbox } from '../../../commons/Flexbox';

const Root = styled.div``;

interface Props {
  locationId?: string;
  onSelectLocation: (locationId: string) => void;
  locations: IAddress[];
}

export const LocationsTable = ({
  locationId,
  onSelectLocation,
  locations,
}: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const [editedLocation, setEditedLocation] = useState<IAddress | null>(null);
  const t = useTranslations();

  const handleEdit = (location: IAddress) => {
    setEditedLocation(location);
    onOpen();
  };
  const columnHelper = createColumnHelper<IAddress>() as any;

  const columns: Array<ColumnDef<any, any>> = [
    columnHelper.accessor((row: any) => row.id, {
      id: 'id',
      header: () => <span />,
      cell: (info: any) => <span />,
    }),
    columnHelper.accessor((row: any) => row.name, {
      id: 'name',
      header: () => <span>{t('Booking.title')}</span>,
      cell: (info: any) => {
        return <span>{info.getValue()}</span>;
      },
    }),
    columnHelper.accessor((row: any) => row.name, {
      id: 'name',
      header: () => <span />,
      cell: (info: any) => {
        const id = info.row.original._id;
        return (
          <Flexbox>
            <Button onClick={() => onSelectLocation(id)}>
              {t('commons.select')}
            </Button>
            <Button onClick={() => handleEdit(info.row.original)}>
              {t('commons.edit')}
            </Button>
          </Flexbox>
        );
      },
    }),
  ];

  return (
    <Root>
      <Button onClick={onOpen}>{t('AddressForm.createAddress')}</Button>
      <Table data={locations} columns={columns} />
      <LocationForm
        onSelectLocation={onSelectLocation}
        open={open}
        onClose={onClose}
        editedLocation={editedLocation}
      />
    </Root>
  );
};
