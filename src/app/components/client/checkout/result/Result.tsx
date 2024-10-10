'use client';

import React, { Suspense } from 'react';
import Success from './Success';
import Failure from './Failure';
import { Page } from '../../commons/layout/Page';

interface Props {
  paymentStatus: boolean;
}

const Result = ({ paymentStatus }: Props) => {
  return (
    <Page>
      <Suspense fallback={<span>Load</span>}>
        {paymentStatus ? <Success /> : <Failure />}
      </Suspense>
    </Page>
  );
};

export default Result;
