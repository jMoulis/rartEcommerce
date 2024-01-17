import emotionStyled from '@emotion/styled';
import { DialogFooter as RootFooter } from '../dialog/DialogFooter';
import { IAction } from './types';

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
        <button
          key={key}
          type='button'
          className={action.className}
          onClick={(event) => handleClick(event, action.callback)}>
          {action.label}
        </button>
      ))}
    </Root>
  );
};
