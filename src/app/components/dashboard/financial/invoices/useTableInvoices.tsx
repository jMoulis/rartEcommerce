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

export const useTableInvoices = (withPdf: boolean, estimate?: boolean) => {
  const t = useTranslations();
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  const columnHelper = createColumnHelper<IInvoiceInput>() as any;

  const handleGenerate = async (invoice: IInvoiceInput) => {
    try {
      setGeneratingId(invoice?._id ?? null);
      await fetch(ENUM_ROUTES.INVOICE_PDF_GENERATE, {
        method: 'post',
        body: JSON.stringify({ invoice, estimate }),
        headers: {
          'Content-type': 'application/json'
        }
      });
      setGeneratingId(null);
    } catch (error: any) {
      toast.error(error.message);
      setGeneratingId(null);
    }
  };
  const columns = [
    columnHelper.accessor((row: any) => row._id, {
      id: '_id',
      header: () => <span>Ref</span>,
      cell: (info: any) => {
        const id = info.row.original._id;
        const url = estimate
          ? ENUM_ROUTES.ESTIMATES
          : ENUM_ROUTES.INVOICE_DETAIL;
        return (
          <Link href={`${url}/${id}`}>
            <span
              style={{
                textDecoration: 'underline'
              }}>
              {info.row.original.invoiceId}
            </span>
          </Link>
        );
      }
    }),
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'createdAt',
      header: () => <span>{t('commons.createdAt')}</span>,
      cell: (info: any) => {
        const dateFormatted = info.getValue()
          ? format(info.getValue(), 'dd/MM/yyyy')
          : '';
        return (
          <span
            style={{
              textAlign: 'center'
            }}>
            {dateFormatted}
          </span>
        );
      }
    }),
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'customer',
      header: () => <span>{t('Customer.contact')}</span>,
      cell: (info: any) => {
        const customer = info.row.original?.customerInformations;
        const customerId = info.row.original?.customerId;
        const customerFullName = `${customer?.firstname} ${customer?.lastname}`;

        return (
          <Link href={`${ENUM_ROUTES.CUSTOMERS}/${customerId}`}>
            <span
              style={{
                textAlign: 'center',
                textDecoration: 'underline'
              }}>
              {customerFullName}
            </span>
          </Link>
        );
      }
    }),
    columnHelper.accessor((row: any) => row.createdAt, {
      id: 'customerName',
      header: () => <span>{t('Customer.companyName')}</span>,
      cell: (info: any) => {
        const customer = info.row.original?.customerInformations;
        const customerId = info.row.original?.customerId;

        return (
          <Link href={`${ENUM_ROUTES.CUSTOMERS}/${customerId}`}>
            <span
              style={{
                textAlign: 'center',
                textDecoration: 'underline'
              }}>
              {customer?.companyName}
            </span>
          </Link>
        );
      }
    }),
    columnHelper.accessor('status', {
      id: 'status',
      header: () => <span>{t('Invoice.status')}</span>,
      cell: (info: any) => (
        <span
          style={{
            textAlign: 'center'
          }}>
          {info.getValue()}
        </span>
      )
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
                  backgroundColor: 'var(--success-color)'
                }}
                href={invoiceUrl}
                target='_blank'
                download={`${invoiceId}.pdf`}>
                {t('commons.download')}
              </ButtonAnchorLink>
            ) : null}

            <Button
              disabled={generatingId === props.row.original._id}
              onClick={async () => handleGenerate(props.row.original)}>
              {t('Invoice.generateInvoice')}
            </Button>
          </Flexbox>
        );
      }
    })
  ];
  return {
    columns
  };
};
