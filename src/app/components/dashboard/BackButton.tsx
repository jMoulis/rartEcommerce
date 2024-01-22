'use client';

import React from 'react';
import { IconButton } from '../commons/Buttons/IconButton';
import { useRouter } from 'next/navigation';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';

const Root = styled.nav`
  margin-top: 20px;
  margin-left: 20px;
`;

export const BackButton = () => {
  const router = useRouter();

  return (
    <Root
      style={{
        gridArea: 'breadcrumb',
      }}>
      <IconButton
        backgroundColor='var(--button-ellipsis-color)'
        icon={faChevronLeft}
        onClick={() => router.back()}
      />
    </Root>
  );
};
