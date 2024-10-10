'use client';

import React from 'react';
import { Section } from '../../client/commons/layout/Section';
import styled from '@emotion/styled';

const CustomSection = styled(Section)`
  label: SectionHeader;
  background-color: var(--secondary-accent);
  padding-top: 100px;
  min-height: 200px;
  @media (max-width: 768px) {
    height: 100px;
  }
`;

interface Props {
  children?: React.ReactNode;
}

export const SectionHeader = ({ children }: Props) => {
  return <CustomSection>{children}</CustomSection>;
};
