import { faEdit } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const Button = styled.button<{ backgroundColor?: string }>`
  display: none;
  padding: 5px;
  border-radius: 100%;
  border: none;
  height: 30px;
  width: 30px;
  margin: 0 2.5px;
  align-items: center;
  justify-content: center;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ?? 'var(--purple-color)'};
  & * {
    color: #fff;
  }
  &:disabled {
    background-color: var(--cancel-color);
  }
`;

interface Props {
  onClick: () => void;
  icon?: IconProp;
  backgroundColor?: string;
  disabled: boolean;
}
export const EditButton = ({
  onClick,
  icon,
  backgroundColor,
  disabled,
}: Props) => {
  return (
    <Button
      backgroundColor={backgroundColor}
      onClick={onClick}
      disabled={disabled}
      className='button-icon edit-button'>
      <FontAwesomeIcon icon={icon ?? faEdit} />
    </Button>
  );
};
