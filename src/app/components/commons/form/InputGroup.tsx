import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';

interface Props {
  label?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string | number;
  defaultValue?: string | number;
  type?: string;
  className?: string;
  styling?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
  };
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
  className,
  styling,
}: Props) => {
  return (
    <Label
      style={styling?.root}
      htmlFor={id}
      className={`input-group ${className ?? ''}`}>
      {label ? (
        <span style={styling?.label} className='input-label'>
          {label}
        </span>
      ) : null}
      <Input
        style={styling?.input}
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
