'use client';

import React from 'react';
import { IconButton } from '../commons/Buttons/IconButton';
import { useRouter } from 'next/navigation';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';

export const Breadcrumb = () => {
  const router = useRouter();

  return <IconButton icon={faChevronLeft} onClick={() => router.back()} />;
};
