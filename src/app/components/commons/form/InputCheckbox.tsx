import React, { ChangeEvent } from 'react';
import { Label } from './Label';
import { Input } from './Input';
import styled from '@emotion/styled';

const CustomLabel = styled(Label)`
  flex-direction: row;
  align-items: center;
`;

const CheckboxInnerText = styled.span`
  margin-bottom: 0;
  margin-right: 5px;
`;

const SquareCheckbox = styled.div<{ checked: boolean }>`
  width: 17px;
  height: 17px;
  border: 2px solid;
  border-radius: 3px;
  cursor: pointer;
  background-color: ${({ checked }) =>
    checked ? 'var(--primary-color)' : 'rgba(255,255,255,0.5)'};
`;

interface Props {
  label?: string;
  onInputChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  id: string;
  name: string;
  value: boolean;
  className?: string;
  styling?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
  };
  disabled?: boolean;
}

export const InputGroupCheckbox = ({
  label,
  onInputChange,
  id,
  name,
  value = false,
  className,
  styling,
  disabled,
}: Props) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onInputChange?.(event);
  };
  return (
    <CustomLabel
      style={styling?.root}
      htmlFor={id}
      className={`input-group ${className ?? ''}`}>
      {label ? (
        <CheckboxInnerText style={styling?.label} className='input-label'>
          {label}
        </CheckboxInnerText>
      ) : null}
      <SquareCheckbox style={styling?.input} checked={value as any} />
      <Input
        type='checkbox'
        id={id}
        name={name}
        onChange={handleInputChange}
        checked={value}
        disabled={disabled}
        style={{
          visibility: 'hidden',
          width: 0,
        }}
      />
    </CustomLabel>
  );
};
