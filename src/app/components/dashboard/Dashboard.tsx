'use client';

import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const Title = styled.h1`
  font-size: 3rem;
  color: white;
`;

export default function Dashboard() {
  const t = useTranslations('Dashboard');
  return (
    <>
      <Title>{t('title')}</Title>
    </>
  );
}
// EZTKf9d1458e91b2468ba6a32e19d51a6fd56WqlIzex83LymATYePdkQQ
