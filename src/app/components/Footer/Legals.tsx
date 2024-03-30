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
`;
const CustomLink = styled(Link)`
  margin: 0 5px;
  font-weight: bold;
  &:hover {
    text-decoration: underline;
  }
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;
const CopyRight = styled.span`
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

interface Props {}

export const Legals = (props: Props) => {
  const t = useTranslations();

  return (
    <Root>
      <CustomLink href={ENUM_ROUTES.LEGALS}>{t('commons.legals')}</CustomLink>
      <CopyRight>- © RartCreation copyright 2024</CopyRight>
    </Root>
  );
};
