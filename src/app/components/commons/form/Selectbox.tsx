import React, { ChangeEvent } from 'react';
import { Label } from './Label';

interface Props {
  options: Array<{ label: string; value: any }>;
  onSelectOption: (event: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  name: string;
  value?: string;
  label: string;
}

export const Selectbox = ({
  options,
  onSelectOption,
  id,
  name,
  value,
  label,
}: Props) => {
  return (
    <Label htmlFor={id}>
      {label}
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
