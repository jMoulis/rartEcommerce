import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Switch } from '@mui/material';

interface Props {
  label?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string | number | boolean;
  defaultValue?: string | number | boolean;
  type?: string;
  disabled?: boolean;
}

export const SwitchGroup = ({
  label,
  onInputChange,
  id,
  name,
  value,
  defaultValue,
  disabled,
}: Props) => {
  return (
    <Label
      htmlFor={id}
      style={{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        marginBottom: 0,
      }}>
      {label ? (
        <span
          className='input-label'
          style={{
            margin: 0,
          }}>
          {label}
        </span>
      ) : null}
      <Switch
        name={name}
        disabled={disabled}
        id={id}
        onChange={onInputChange}
        defaultChecked={defaultValue as boolean}
        checked={value as boolean}
      />
    </Label>
  );
};
