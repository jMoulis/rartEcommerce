import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';

interface Props {
  label: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string | number;
  defaultValue?: string | number;
  type?: string;
}

export const InputGroup = ({
  label,
  onInputChange,
  id,
  name,
  value,
  defaultValue,
  type,
  onBlur,
}: Props) => {
  return (
    <Label htmlFor={id} className='input-group'>
      <span className='input-label'>{label}</span>
      <Input
        type={type}
        id={id}
        name={name}
        onChange={onInputChange}
        onBlur={onBlur}
        value={value ?? undefined}
        defaultValue={defaultValue}
      />
    </Label>
  );
};
