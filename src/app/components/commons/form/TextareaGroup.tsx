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
  style?: React.CSSProperties;
  onBlur?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

export const TextareaGroup = ({
  label,
  onInputChange,
  id,
  name,
  value,
  defaultValue,
  style,
  onBlur,
  className,
}: Props) => {
  return (
    <Label htmlFor={id} className={`input-group ${className ?? ''}`}>
      <span className='input-label'>{label}</span>
      <Textarea
        style={style}
        id={id}
        name={name}
        onChange={onInputChange}
        value={value ?? undefined}
        defaultValue={defaultValue ?? undefined}
        onBlur={onBlur}
      />
    </Label>
  );
};
