'use client';

import { IInvoiceInput } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { FinderLayoutPage } from '../../../commons/Layouts/FinderLayoutPage';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '../../../commons/Buttons/Button';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';
import { Flexbox } from '../../../commons/Flexbox';
import { ButtonAnchorLink } from '../../../client/checkout/processing/commons/ButtonLink';

interface Props {
  initialInvoices: IInvoiceInput[];
}

export const Invoices = ({ initialInvoices }: Props) => {
  const [data, setData] = useState<IInvoiceInput[]>(initialInvoices);
  const t = useTranslations();
  const columnHelper = createColumnHelper<IInvoiceInput>() as any;
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.INVOICES,
      (payload) => {
        setData(payload);
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

  const handleGenerate = async (invoice: IInvoiceInput) => {
    try {
      setGenerating(true);
      await fetch('/api/invoices/generate', {
        method: 'post',
        body: JSON.stringify(invoice),
        headers: {
          'Content-type': 'application/json',
        },
      });
      setGenerating(false);
    } catch (error: any) {
      toast.error(error.message);
      setGenerating(false);
    }
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
        const invoiceUrl = props.row.original?.invoiceUrl;
        const invoiceId = props.row.original?.invoiceId;
        return (
          <Flexbox alignItems='center' justifyContent='center'>
            {invoiceUrl ? (
              <ButtonAnchorLink
                style={{
                  backgroundColor: 'var(--success-color)',
                }}
                href={invoiceUrl}
                target='_blank'
                download={`${invoiceId}.pdf`}>
                {t('commons.download')}
              </ButtonAnchorLink>
            ) : (
              <Button
                disabled={generating}
                onClick={async () => handleGenerate(props.row.original)}>
                {t('Invoice.generateInvoice')}
              </Button>
            )}
          </Flexbox>
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
