import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';
import styled from '@emotion/styled';
import { Flexbox } from '../Flexbox';

const InputLabelText = styled.span`
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
`;

interface Props {
  label?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value?: string | number | boolean;
  defaultValue?: string | number;
  type?: string;
  className?: string;
  required?: boolean;
  placeholder?: string;
  styling?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    labelTip?: React.CSSProperties;
    required?: React.CSSProperties;
  };
  CustomLabel?: JSX.Element;
  autoComplete?: string;
  labelTip?: string;
  disabled?: boolean;
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
  required,
  CustomLabel,
  autoComplete,
  placeholder,
  labelTip,
  disabled
}: Props) => {
  return (
    <Label
      style={styling?.root}
      htmlFor={id}
      className={`input-group ${className ?? ''}`}>
      {CustomLabel ??
        (label ? (
          <Flexbox>
            <InputLabelText style={styling?.label} className='input-label'>
              {label}
            </InputLabelText>
            {labelTip ? (
              <InputLabelText style={styling?.labelTip}>
                {labelTip}
              </InputLabelText>
            ) : null}
            {required ? (
              <InputLabelText style={styling?.required}>*</InputLabelText>
            ) : null}
          </Flexbox>
        ) : null)}
      <Input
        style={styling?.input}
        type={type}
        id={id}
        name={name}
        disabled={disabled}
        onChange={onInputChange}
        onBlur={onBlur}
        value={(value as string) ?? undefined}
        defaultValue={defaultValue}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </Label>
  );
};
