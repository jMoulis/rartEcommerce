import React from 'react';
import { Section } from '../commons/layout/Section';
import styled from '@emotion/styled';

const CustomSection = styled(Section)`
  background-color: var(--secondary-accent);
  padding-top: 100px;
  height: 300px;
`;

interface Props {
  children?: React.ReactNode;
}

export const SectionHeader = ({ children }: Props) => {
  return <CustomSection>{children}</CustomSection>;
};
