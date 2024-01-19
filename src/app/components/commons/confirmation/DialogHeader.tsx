import emotionStyled from '@emotion/styled';
import { CloseModalButton } from '../Buttons/CloseModalButton';

const Root = emotionStyled.header``;

interface Props {
  onClose: VoidFunction;
  title: string;
}
export const DialogHeader = ({ onClose, title }: Props) => {
  return (
    <Root>
      <h2>{title}</h2>
      <CloseModalButton onClose={onClose} />
    </Root>
  );
};
