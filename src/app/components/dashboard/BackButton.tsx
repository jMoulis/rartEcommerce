'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Button } from '../commons/Buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Root = styled.nav`
  margin-top: 20px;
  margin-left: 20px;
  display: flex;
  align-items: center;
  & * {
    color: #fff;
  }
`;

export const BackButton = () => {
  const router = useRouter();
  const t = useTranslations();
  return (
    <Root
      style={{
        gridArea: 'breadcrumb'
      }}>
      <Button
        style={{
          fontSize: '20px'
        }}
        onClick={() => router.back()}>
        <FontAwesomeIcon
          icon={faChevronLeft as any}
          style={{
            marginRight: '10px'
          }}
        />
        <span>{t('commons.back')}</span>
      </Button>
    </Root>
  );
};
