import React, { ChangeEvent } from 'react';
import { Label } from './Label';

interface Props {
  options: Array<{ label: string; value: any }>;
  onSelectOption?: (event: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  name: string;
  value?: string;
  label: string;
  className?: string;
}

export const Selectbox = ({
  options,
  onSelectOption,
  id,
  name,
  value,
  label,
  className,
}: Props) => {
  return (
    <Label htmlFor={id} className={`input-group ${className ?? ''}`}>
      <span className='input-label'>{label}</span>
      <select id={id} name={name} value={value} onChange={onSelectOption}>
        {options.map((option, key) => (
          <option key={key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Label>
  );
};
