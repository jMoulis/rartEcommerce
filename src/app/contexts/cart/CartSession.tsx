'use client';

import React from 'react';
import { useCartSession } from './useCartSession';

interface Props {
  children: React.ReactNode;
}
export const CartSession = ({ children }: Props) => {
  useCartSession();
  return <>{children}</>;
};
