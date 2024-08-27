'use client';

import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICustomer } from '@/src/types/DBTypes';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import Link from 'next/link';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';

interface Props {
  initialCustomers: ICustomer[];
}

export const Customers = ({ initialCustomers }: Props) => {
  const [customers, setCustomers] = useState<ICustomer[]>(initialCustomers);
  const t = useTranslations();
  const columnHelper = createColumnHelper<ICustomer>();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.CUSTOMERS,
      (payload) => {
        setCustomers(payload);
      },
      (error) => {
        toast.error(error.message);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
  const columns = [
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'customer',
      header: () => <span>{t('commons.name')}</span>,
      cell: (info: any) => {
        const customer = info.row.original;
        const id = info.row.original._id;
        const customerFullName = `${customer?.firstname} ${customer?.lastname}`;
        return (
          <Link href={`${ENUM_ROUTES.CUSTOMERS}/${id}`}>
            <span
              style={{
                textDecoration: 'underline'
              }}>
              {customerFullName}
            </span>
          </Link>
        );
      }
    }),
    columnHelper.display({
      id: 'company',
      header: 'Désignation sociale',
      cell: ({ row }) => {
        return <span>{row.original.companyName}</span>;
      }
    })
  ];

  return (
    <FinderLayoutPage
      sectionTitle={t('Dashboard.customers')}
      data={customers}
      columns={columns}
      createLink={{
        href: `${ENUM_ROUTES.CUSTOMERS_CREATE}`,
        label: t('Customer.createCustomer')
      }}
    />
  );
};
