'use client';

import { useCart } from '@/src/app/contexts/cart/CartContext';
import React, { useEffect } from 'react';
import { Page } from '../../commons/layout/Page';
import { SectionHeader } from '../../../commons/Layouts/SectionHeader';

interface Props {}

const Success = (props: Props) => {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);
  return (
    <Page>
      <SectionHeader />
      Success
    </Page>
  );
};

export default Success;
