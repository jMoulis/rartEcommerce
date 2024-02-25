'use client';

import { useCart } from '@/src/app/contexts/cart/CartContext';
import React, { useEffect } from 'react';
import { IInvoiceInput } from '@/src/types/DBTypes';
import { SectionPage } from '../../../commons/Layouts/SectionPage';

interface Props {
  invoice: IInvoiceInput | null;
}

const Success = ({ invoice }: Props) => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <SectionPage>
      <h1>Féliciations</h1>
      <pre>{JSON.stringify(invoice, null, 2)}</pre>
      {invoice?.receiptUrl ? (
        <a download href={invoice.receiptUrl} target='_blank'>
          Récipicé
        </a>
      ) : null}
    </SectionPage>
  );
};

export default Success;
