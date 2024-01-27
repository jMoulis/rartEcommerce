'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Logo } from '../navbar/Logo';

const Root = styled.footer`
  display: flex;
  padding: 40px;
`;
interface Props {}

export const Footer = (props: Props) => {
  return (
    <Root>
      <Logo
        size={{
          width: 100,
          height: 100,
        }}
      />
    </Root>
  );
};
