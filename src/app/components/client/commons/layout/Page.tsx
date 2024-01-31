'use client';

import styled from '@emotion/styled';
import { Footer } from '../../../Footer/Footer';
import { CSSProperties, ReactNode } from 'react';

const Root = styled.main`
  height: 100vh;
  overflow: auto;
  padding-top: 80px;
  @media (max-width: 768px) {
    padding-top: 70px;
  }
`;

interface Props {
  children: ReactNode;
  style?: CSSProperties;
}
export const Page = ({ children, style }: Props) => {
  return (
    <Root id='page-layout' style={style}>
      {children}
      <Footer />
    </Root>
  );
};
