'use client';

import { IBooking } from '@/src/types/DBTypes';
import React, { useMemo } from 'react';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Props {
  bookings?: IBooking[];
}

export const Bookings = ({ bookings }: Props) => {
  const data: IBooking[] = useMemo(() => bookings ?? [], []);
  const t = useTranslations();

  const columnHelper = createColumnHelper<IBooking>() as any;

  const columns: Array<ColumnDef<any, any>> = [
    columnHelper.accessor((row: any) => row.id, {
      id: 'id',
      header: () => <span />,
      cell: (info: any) => <span />,
    }),
    columnHelper.accessor((row: any) => row.name, {
      id: 'name',
      header: () => <span>{t('commons.name')}</span>,
      cell: (info: any) => {
        const id = info.row.original._id;
        return (
          <Link href={`/dashboard/bookings/${id}`}>{info.getValue()}</Link>
        );
      },
    }),
  ];

  return (
    <FinderLayoutPage
      data={data}
      columns={columns}
      sectionTitle=''
      createLink={{
        label: t('Booking.createBooking'),
        href: '/dashboard/bookings/create',
      }}
    />
  );
};
