import emotionStyled from '@emotion/styled';

const Root = emotionStyled.footer``;

interface Props {
  onClose: () => void;
  actions: Array<{
    label: string;
    callback: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }>;
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
          onClick={(event) => handleClick(event, action.callback)}>
          {action.label}
        </button>
      ))}
    </Root>
  );
};
