'use client';

import { IInvoiceInput } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { FinderLayoutPage } from '../../../commons/Layouts/FinderLayoutPage';
import { useTranslations } from 'next-intl';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';
import { useTableInvoices } from './useTableInvoices';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';

interface Props {
  initialInvoices: IInvoiceInput[];
  shouldSubscribe: boolean;
}

export const Invoices = ({ initialInvoices, shouldSubscribe }: Props) => {
  const [invoices, setInvoices] = useState<IInvoiceInput[]>(initialInvoices);
  const t = useTranslations();
  const { columns } = useTableInvoices(true);

  useEffect(() => {
    if (!shouldSubscribe) return;
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.INVOICES,
      (payload) => {
        setInvoices(payload);
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
  return (
    <FinderLayoutPage
      sectionTitle={t('Dashboard.invoices')}
      data={invoices}
      columns={columns}
      createLink={{
        href: `${ENUM_ROUTES.CREATE_INVOICE}`,
        label: t('Invoice.createInvoice')
      }}
    />
  );
};
