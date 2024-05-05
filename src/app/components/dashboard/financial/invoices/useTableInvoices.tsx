'use client';

import { IInvoiceInput } from '@/src/types/DBTypes';
import React, { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '../../../commons/Buttons/Button';
import { toast } from 'react-toastify';
import { Flexbox } from '../../../commons/Flexbox';
import { ButtonAnchorLink } from '../../../client/checkout/commons/ButtonLink';
import { format } from 'date-fns';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';

export const useTableInvoices = (withPdf: boolean) => {
  const t = useTranslations();
  const [generating, setGenerating] = useState(false);

  const columnHelper = createColumnHelper<IInvoiceInput>() as any;

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
          <Link href={`${ENUM_ROUTES.INVOICE_DETAIL}/${id}`}>
            <span
              style={{
                textDecoration: 'underline',
              }}>
              {info.row.original.invoiceId}
            </span>
          </Link>
        );
      },
    }),
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'createdAt',
      header: () => <span>{t('commons.createdAt')}</span>,
      cell: (info: any) => {
        const dateFormatted = format(info.getValue(), 'dd/MM/yyyy');
        return (
          <span
            style={{
              textAlign: 'center',
            }}>
            {dateFormatted}
          </span>
        );
      },
    }),
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'customer',
      header: () => <span>{t('Customer.customer')}</span>,
      cell: (info: any) => {
        const customer = info.row.original?.customerInformations;
        const customerId = info.row.original?.customerId;
        const customerFullName = `${customer?.firstname} ${customer?.lastname}`;

        return (
          <Link href={`${ENUM_ROUTES.CUSTOMERS}/${customerId}`}>
            <span
              style={{
                textAlign: 'center',
                textDecoration: 'underline',
              }}>
              {customerFullName}
            </span>
          </Link>
        );
      },
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => <span>{t('Invoice.status')}</span>,
      cell: (info: any) => (
        <span
          style={{
            textAlign: 'center',
          }}>
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      cell: (props: any) => {
        const invoiceUrl = props.row.original?.invoiceUrl;
        const invoiceId = props.row.original?.invoiceId;
        if (!withPdf) return <span />;
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
  return {
    columns,
    generating,
  };
};
