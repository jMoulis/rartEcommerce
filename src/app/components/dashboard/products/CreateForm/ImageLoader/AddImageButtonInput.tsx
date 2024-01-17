import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';

const Root = styled.label`
  padding: 5px 23px;
  border-radius: 18px;
  background-color: #3899ec;
  display: flex;
  cursor: pointer;
  font-size: 15px;
  color: #fff;
  align-items: center;
  transition: background-color 150ms ease;
  &:hover {
    background-color: #4eb7f5;
  }
`;
interface Props {
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  label: string;
}

export const AddImageButtonInput = ({ onUpload, id, label }: Props) => {
  return (
    <Root htmlFor={id}>
      {label}
      <input
        style={{
          visibility: 'hidden',
          width: 0,
        }}
        name={id}
        id={id}
        onChange={onUpload}
        type='file'
        multiple
      />
    </Root>
  );
};
