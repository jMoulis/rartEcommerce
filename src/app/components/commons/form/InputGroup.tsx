import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';

interface Props {
  label: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string;
}

export const InputGroup = ({
  label,
  onInputChange,
  id,
  name,
  value,
}: Props) => {
  return (
    <Label htmlFor={id}>
      {label}
      <Input id={id} name={name} onChange={onInputChange} value={value} />
    </Label>
  );
};
