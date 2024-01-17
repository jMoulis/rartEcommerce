import React from 'react';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/pro-light-svg-icons';

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
      {onClose ? (
        <button type='button' onClick={onClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      ) : null}
    </Header>
  );
};
