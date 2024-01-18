import React from 'react';
import styled from '@emotion/styled';
import { CloseModalButton } from '../confirmation/Buttons/CloseModalButton';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--card-header-border-color);
`;

interface Props {
  title: string;
  onClose?: VoidFunction;
}

export const DialogHeader = ({ title, onClose }: Props) => {
  return (
    <Header>
      <h1>{title}</h1>
      {onClose ? <CloseModalButton onClose={onClose} /> : null}
    </Header>
  );
};
