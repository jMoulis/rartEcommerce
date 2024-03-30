'use client';

import styled from '@emotion/styled';
import { Footer } from '../../../Footer/Footer';
import { CSSProperties, ReactNode } from 'react';

const Root = styled.main`
  min-height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  @media (max-width: 768px) {
    /* padding-top: 70px; */
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
