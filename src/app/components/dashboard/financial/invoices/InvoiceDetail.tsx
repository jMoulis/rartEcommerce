'use client';

import { IInvoiceInput } from '@/src/types/DBTypes';
import React from 'react';

interface Props {
  invoice?: IInvoiceInput;
}

export const InvoiceDetail = ({ invoice }: Props) => {
  return <h1>Detail</h1>;
};
