import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ISubscription, IWorkshop } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';

import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { SubscriptionForm } from './SubscriptionForm';
import { useToggle } from '../../../hooks/useToggle';
import { Button } from '../../../commons/Buttons/Button';
import { Table } from '../../../commons/Table/Table';
import { Flexbox } from '../../../commons/Flexbox';

const Root = styled.div``;

interface Props {
  onSubscriptionChange: (subscriptionId: string) => void;
  subscriptions: ISubscription[];
  workshop: IWorkshop;
}

export const SubscriptionTable = ({
  onSubscriptionChange,
  subscriptions,
  workshop,
}: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const [editedSubscription, setEditedSubscription] =
    useState<ISubscription | null>(null);
  const t = useTranslations();

  const columnHelper = createColumnHelper<ISubscription>() as any;

  const handleEdit = (subscription: ISubscription) => {
    setEditedSubscription(subscription);
    onOpen();
  };
  const columns: Array<ColumnDef<any, any>> = [
    columnHelper.accessor((row: any) => row.id, {
      id: 'id',
      header: () => <span />,
      cell: () => <span />,
    }),
    columnHelper.accessor((row: any) => row.name, {
      id: 'name',
      header: () => <span>{t('commons.name')}</span>,
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
            <Button onClick={() => onSubscriptionChange(id)}>
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
      <Button onClick={onOpen}>{t('Subscription.createSubscription')}</Button>
      <Table data={subscriptions} columns={columns} />
      <SubscriptionForm
        onSubscriptionChange={onSubscriptionChange}
        open={open}
        onClose={onClose}
        editedSubscription={editedSubscription}
        workshop={workshop}
      />
    </Root>
  );
};
