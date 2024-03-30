import { useTranslations } from 'next-intl';
import React from 'react';
import styled from '@emotion/styled';

const Root = styled.h3`
  color: #fff;
  padding-bottom: 5px;
`;

const Slogan = () => {
  const t = useTranslations();
  return <Root>{t('Home.slogan')}</Root>;
};

export default Slogan;
