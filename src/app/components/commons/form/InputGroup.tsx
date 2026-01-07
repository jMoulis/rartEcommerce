import React, { forwardRef } from 'react';
import { Label } from './Label';
import { Input } from './Input';
import styled from '@emotion/styled';
import { Flexbox } from '../Flexbox';

const InputLabelText = styled.span`
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  rootClassName?: string;
  styling?: {
    root?: React.CSSProperties;
    label?: React.CSSProperties;
    input?: React.CSSProperties;
    labelTip?: React.CSSProperties;
    required?: React.CSSProperties;
  };
  CustomLabel?: JSX.Element;
  labelTip?: string;
}

export const InputGroup = forwardRef<HTMLInputElement, Props>(
  ({ label, styling, CustomLabel, labelTip, ...rest }, ref) => {
    return (
      <Label
        style={styling?.root}
        htmlFor={rest.id}
        className={`input-group ${rest.className ?? ''}`}>
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
              {rest.required ? (
                <InputLabelText style={styling?.required}>*</InputLabelText>
              ) : null}
            </Flexbox>
          ) : null)}
        <Input ref={ref} {...rest} style={styling?.input} />
      </Label>
    );
  }
);
