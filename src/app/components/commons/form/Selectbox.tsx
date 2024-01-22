import React, { CSSProperties, ChangeEvent } from 'react';
import { Label } from './Label';

interface Props {
  options: Array<{ label: string; value: any }>;
  onSelectOption?: (event: ChangeEvent<HTMLSelectElement>) => void;
  id: string;
  name: string;
  value?: string;
  label?: string;
  className?: string;
  styling?: {
    root?: CSSProperties;
    label?: CSSProperties;
    select?: CSSProperties;
  };
}

export const Selectbox = ({
  options,
  onSelectOption,
  id,
  name,
  value,
  label,
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
      <select
        style={styling?.select}
        id={id}
        name={name}
        value={value}
        onChange={onSelectOption}>
        {options.map((option, key) => (
          <option key={key} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Label>
  );
};
