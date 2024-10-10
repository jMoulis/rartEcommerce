import React from 'react';
import styled from '@emotion/styled';
import { CollapseButton } from '@/src/app/components/commons/Buttons/CollapseButton';

const Header = styled.header`
  display: grid;
  grid-template-columns: 25px 1fr;
`;

interface Props {
  title: string;
  onToggle?: VoidFunction;
  open: boolean;
}

export const CollapseHeader = ({ title, onToggle, open }: Props) => {
  return (
    <Header>
      <CollapseButton onToggle={onToggle} open={open} />
      <h2>{title}</h2>
    </Header>
  );
};
