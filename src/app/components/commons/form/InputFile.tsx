'use client';

import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';

interface Props {
  label: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
}

export const InputFile = ({ label, onInputChange, id, name }: Props) => {
  return (
    <Label htmlFor={id}>
      {label}
      <Input id={id} type='file' name={name} onChange={onInputChange} />
    </Label>
  );
};
