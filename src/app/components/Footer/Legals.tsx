import React from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../commons/Flexbox';
import Link from 'next/link';
import { ENUM_ROUTES } from '../navbar/routes.enums';
import { useTranslations } from 'next-intl';

const Root = styled(Flexbox)`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const CustomLink = styled(Link)`
  margin: 0 5px;
  font-weight: bold;
  color: #fff;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
const CopyRight = styled.span`
  color: #fff;
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

export const Legals = () => {
  const t = useTranslations();
  const year = new Date().getFullYear();
  return (
    <Root>
      <CustomLink href={ENUM_ROUTES.LEGALS}>{t('commons.legals')}</CustomLink>
      <CopyRight>{`- © RartCreation copyright ${year}`}</CopyRight>
    </Root>
  );
};
