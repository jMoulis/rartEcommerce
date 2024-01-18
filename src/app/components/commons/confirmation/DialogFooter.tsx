import emotionStyled from '@emotion/styled';
import { DialogFooter as RootFooter } from '../dialog/DialogFooter';
import { IAction } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from './Buttons/Button';

const Root = emotionStyled(RootFooter)``;

interface Props {
  onClose: () => void;
  actions: IAction[];
}

export const DialogFooter = ({ actions, onClose }: Props) => {
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    callback: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ) => {
    callback(event);
    onClose();
  };
  return (
    <Root>
      {actions.map((action, key) => (
        <Button
          key={key}
          type='button'
          style={action.style}
          onClick={(event) => handleClick(event, action.callback)}>
          {action.icon ? <FontAwesomeIcon icon={action.icon} /> : null}
          {action.label}
        </Button>
      ))}
    </Root>
  );
};
