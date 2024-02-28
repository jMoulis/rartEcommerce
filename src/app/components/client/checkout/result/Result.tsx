'use client';

import React, { Suspense } from 'react';
import { IInvoiceInput } from '@/src/types/DBTypes';
import { SectionPage } from '../../../commons/Layouts/SectionPage';
import Success from './Success';
import Failure from './Failure';

interface Props {
  invoice: IInvoiceInput | null;
  paymentStatus: boolean;
}

const Result = ({ invoice, paymentStatus }: Props) => {
  return (
    <SectionPage>
      <Suspense fallback={<span>Load</span>}>
        {paymentStatus ? <Success invoice={invoice} /> : <Failure />}
      </Suspense>
    </SectionPage>
  );
};

export default Result;
