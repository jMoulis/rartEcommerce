import React from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '../commons/Flexbox';
import { Logo } from './Logo';
import Slogan from './Slogan';

const LogoSloganWrapper = styled(Flexbox)`
  @media (max-width: 768px) {
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
`;

interface Props {}

export const MainNavHeader = (props: Props) => {
  return (
    <LogoSloganWrapper alignItems='center'>
      <Logo />
      <Slogan />
    </LogoSloganWrapper>
  );
};
