'use client';

import { IEstimateInput } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { FinderLayoutPage } from '../../../commons/Layouts/FinderLayoutPage';
import { useTranslations } from 'next-intl';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';
import { ENUM_ROUTES } from '../../../navbar/routes.enums';
import { useTableInvoices } from '../invoices/useTableInvoices';

interface Props {
  initialEstimates: IEstimateInput[];
  shouldSubscribe: boolean;
}

export const Estimates = ({ initialEstimates, shouldSubscribe }: Props) => {
  const [estimates, setEstimates] =
    useState<IEstimateInput[]>(initialEstimates);
  const t = useTranslations();
  const { columns } = useTableInvoices(true, true);

  useEffect(() => {
    if (!shouldSubscribe) return;
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.ESTIMATES,
      (payload) => {
        setEstimates(payload);
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
      sectionTitle={t('Dashboard.estimates')}
      data={estimates}
      columns={columns}
      createLink={{
        href: `${ENUM_ROUTES.CREATE_ESTIMATE}`,
        label: t('Estimate.createEstimate')
      }}
    />
  );
};
