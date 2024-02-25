import styled from '@emotion/styled';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CSSProperties } from 'react';

const Root = styled(Button)<{
  variant?: 'normal' | 'xs';
  backgroundColor?: string;
}>`
  border-radius: 100px;
  padding: ${({ variant }) => {
    if (variant === 'xs') return '5px';
    return '10px';
  }};
  width: ${({ variant }) => {
    if (variant === 'xs') return '20px';
    return '30px';
  }};
  height: ${({ variant }) => {
    if (variant === 'xs') return '20px';
    return '30px';
  }};
  font-size: ${({ variant }) => {
    if (variant === 'xs') return '10px';
    return '15px';
  }};

  background-color: ${({ backgroundColor }) => backgroundColor};
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface Props {
  icon: IconProp;
  className?: string;
  variant?: 'normal' | 'xs';
  backgroundColor?: string;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export const IconButton = ({
  icon,
  className,
  variant = 'normal',
  backgroundColor,
  onClick,
  disabled,
  style,
}: Props) => {
  return (
    <Root
      type='button'
      style={style}
      onClick={onClick}
      disabled={disabled}
      className={className}
      variant={variant}
      backgroundColor={backgroundColor}>
      <FontAwesomeIcon
        icon={icon}
        style={{
          color: `${style?.color} !important`,
        }}
      />
    </Root>
  );
};
