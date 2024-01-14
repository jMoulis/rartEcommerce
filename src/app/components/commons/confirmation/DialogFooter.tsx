import emotionStyled from '@emotion/styled';

const Root = emotionStyled.footer``;

interface Props {
  actions: Array<{
    label: string;
    callback: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  }>;
}

export const DialogFooter = ({ actions }: Props) => {
  return (
    <Root>
      {actions.map((action, key) => (
        <button key={key} type='button' onClick={action.callback}>
          {action.label}
        </button>
      ))}
    </Root>
  );
};
