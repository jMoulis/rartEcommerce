'use client';

import { IOrder } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';
import { useTranslations } from 'next-intl';
import { useTableInvoices } from '../financial/invoices/useTableInvoices';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';

interface Props {
  initialOrders?: IOrder[];
  shouldSubscribe?: boolean;
}

export const Orders = ({ initialOrders, shouldSubscribe }: Props) => {
  const [orders, setOrders] = useState<IOrder[]>(initialOrders ?? []);
  const t = useTranslations();
  const { columns } = useTableInvoices(false);

  useEffect(() => {
    if (!shouldSubscribe) return;
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.ORDERS,
      (payload) => {
        setOrders(payload);
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
      sectionTitle={t('Dashboard.orders')}
      data={orders}
      columns={columns}
    />
  );
};
