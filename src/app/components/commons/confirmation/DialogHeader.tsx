import emotionStyled from '@emotion/styled';

const Root = emotionStyled.header``;

interface Props {
  onClose: VoidFunction;
  title: string;
}
export const DialogHeader = ({ onClose, title }: Props) => {
  return (
    <Root>
      <h2>{title}</h2>
      <button type='button' onClick={onClose}>
        X
      </button>
    </Root>
  );
};
