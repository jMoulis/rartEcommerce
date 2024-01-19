import React, { CSSProperties } from 'react';
import styled from '@emotion/styled';
import { CloseModalButton } from '../Buttons/CloseModalButton';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid var(--card-header-border-color);
`;

interface Props {
  title: string;
  onClose?: VoidFunction;
  styling?: {
    root?: CSSProperties;
    title?: CSSProperties;
    button?: {
      root?: CSSProperties;
      icon?: CSSProperties;
    };
  };
}

export const DialogHeader = ({ title, onClose, styling }: Props) => {
  return (
    <Header style={styling?.root}>
      <h1 style={styling?.title}>{title}</h1>
      {onClose ? (
        <CloseModalButton styling={styling?.button} onClose={onClose} />
      ) : null}
    </Header>
  );
};
