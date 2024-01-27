import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Textarea } from './Textarea';

interface Props {
  label: string;
  onInputChange?: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  id: string;
  name: string;
  value?: string;
  defaultValue?: string;
  styling?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
  };
  onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
}

export const TextareaGroup = ({
  label,
  onInputChange,
  id,
  name,
  value,
  defaultValue,
  styling,
  onBlur,
  className,
  required,
}: Props) => {
  return (
    <Label
      style={styling?.root}
      htmlFor={id}
      className={`input-group ${className ?? ''}`}>
      <span style={styling?.label} className='input-label'>
        {label}
      </span>
      <Textarea
        style={styling?.input}
        id={id}
        name={name}
        onChange={onInputChange}
        value={value ?? undefined}
        defaultValue={defaultValue ?? undefined}
        onBlur={onBlur}
        required={required}
      />
    </Label>
  );
};
