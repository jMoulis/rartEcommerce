import styled from '@emotion/styled';
import { Button } from './Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

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
  & * {
    font-size: ${({ variant }) => {
      if (variant === 'xs') return '10px';
      return '20px';
    }};
  }
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
}

export const IconButton = ({
  icon,
  className,
  variant = 'normal',
  backgroundColor,
  onClick,
  disabled,
}: Props) => {
  return (
    <Root
      type='button'
      onClick={onClick}
      disabled={disabled}
      className={className}
      variant={variant}
      backgroundColor={backgroundColor}>
      <FontAwesomeIcon icon={icon} />
    </Root>
  );
};
