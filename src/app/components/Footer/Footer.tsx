'use client';

import React from 'react';
import styled from '@emotion/styled';
import { Logo } from '../navbar/Logo';
import { SocialNetworks } from './SocialNetworks';
import { Flexbox } from '../commons/Flexbox';
import { Legals } from './Legals';

const Root = styled.footer`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: var(--primary-color);
  justify-content: space-between;
  @media (max-width: 768px) {
    padding: 20px;
  }
`;
interface Props {}

export const Footer = (props: Props) => {
  return (
    <Root>
      <Flexbox flex='1' alignItems='center' justifyContent='space-between'>
        <Logo
          size={{
            width: '70px',
            height: '70px',
          }}
        />
        <SocialNetworks />
      </Flexbox>
      <Legals />
    </Root>
  );
};
