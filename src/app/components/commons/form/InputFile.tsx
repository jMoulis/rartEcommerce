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
  className?: string;
  styling?: {
    root: React.CSSProperties;
    label: React.CSSProperties;
    image: React.CSSProperties;
  };
}

export const InputFile = ({
  label,
  onInputChange,
  id,
  name,
  value,
  placeholder,
  styling,
  className,
}: Props) => {
  return (
    <Label
      style={styling?.root}
      htmlFor={id}
      className={`input-group ${className ?? ''}`}>
      <span style={styling?.label} className='input-label'>
        {label}
      </span>
      {value ? (
        <Image
          alt='Profile'
          style={{
            borderRadius: '5px',
            marginBottom: '5px',
            ...styling?.image,
          }}
          src={value}
          width={50}
          height={50}
        />
      ) : (
        placeholder
      )}
      <Input id={id} type='file' name={name} onChange={onInputChange} />
    </Label>
  );
};
