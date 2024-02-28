'use client';

import { IInvoiceInput, IProductService } from '@/src/types/DBTypes';
import React, { useMemo } from 'react';
import { FinderLayoutPage } from '../../../commons/Layouts/FinderLayoutPage';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@mui/material';

interface Props {
  invoices: IInvoiceInput[];
}

export const Invoices = ({ invoices }: Props) => {
  const data: IInvoiceInput[] = useMemo(() => invoices ?? [], []);
  const t = useTranslations();
  const columnHelper = createColumnHelper<IInvoiceInput>() as any;

  const handleGenerate = (invoice: IInvoiceInput) => {
    fetch('/api/invoices/generate', {
      method: 'post',
      body: JSON.stringify(invoice),
      headers: {
        'Content-type': 'application/json',
      },
    });
  };

  const columns = [
    columnHelper.accessor((row: any) => row._id, {
      id: '_id',
      header: () => <span>Ref</span>,
      cell: (info: any) => {
        const id = info.row.original._id;
        return (
          <Link href={`/dashboard/financial/invoices/${id}`}>
            {info.getValue()}
          </Link>
        );
      },
    }),
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'createdAt',
      header: () => <span>{t('commons.createdAt')}</span>,
      cell: (info: any) => <span>{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => <span>{t('Invoice.status')}</span>,
      cell: (info: any) => <span>{info.getValue()}</span>,
    }),

    columnHelper.display({
      id: 'actions',
      cell: (props: any) => {
        return (
          <Button onClick={() => handleGenerate(props.row.original)}>
            GeneratePDF
          </Button>
        );
      },
    }),
  ];

  return (
    <FinderLayoutPage
      sectionTitle={t('Dashboard.invoices')}
      data={data}
      columns={columns}
      createLink={{
        href: '/dashboard/invoices/create',
        label: t('Invoice.createInvoice'),
      }}
    />
  );
};
