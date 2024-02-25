'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Logo } from '../navbar/Logo';

const Root = styled.footer`
  display: flex;
  padding: 40px;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;
interface Props {}

export const Footer = (props: Props) => {
  return (
    <Root>
      <Logo
        size={{
          width: '100px',
          height: '100px',
          responsiveHeight: '50px',
          responsiveWidth: '50px',
        }}
      />
    </Root>
  );
};
