'use client';

import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';
import Image from 'next/image';

interface Props {
  label: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string;
  placeholder?: React.ReactNode;
}

export const InputFile = ({
  label,
  onInputChange,
  id,
  name,
  value,
  placeholder,
}: Props) => {
  return (
    <Label htmlFor={id}>
      {label}
      <Input id={id} type='file' name={name} onChange={onInputChange} />
      {value ? (
        <Image alt='Profile' src={value} width={50} height={50} />
      ) : (
        placeholder
      )}
    </Label>
  );
};
