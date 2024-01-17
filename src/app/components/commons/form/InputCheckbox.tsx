import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';
import styled from '@emotion/styled';

const CustomLabel = styled(Label)`
  flex-direction: row;
`;
interface Props {
  label: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string | boolean;
}

export const InputGroupCheckbox = ({
  label,
  onInputChange,
  id,
  name,
  value,
}: Props) => {
  return (
    <CustomLabel htmlFor={id}>
      <span>{label}</span>
      <Input
        type='checkbox'
        id={id}
        name={name}
        onChange={onInputChange}
        checked={value as boolean}
      />
    </CustomLabel>
  );
};
