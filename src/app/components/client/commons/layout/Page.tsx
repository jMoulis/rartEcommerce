'use client';

import styled from '@emotion/styled';
import { Footer } from '../../../Footer/Footer';
import { ReactNode } from 'react';

const Root = styled.main`
  height: 100vh;
  overflow: auto;
  padding-top: 80px;
`;

interface Props {
  children: ReactNode;
}
export const Page = ({ children }: Props) => {
  return (
    <Root>
      {children}
      <Footer />
    </Root>
  );
};
