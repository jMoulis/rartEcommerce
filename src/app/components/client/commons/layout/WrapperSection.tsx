import { Flexbox } from '../../../commons/Flexbox';

interface Props {
  children: React.ReactNode;
}
export default ({ children }: Props) => {
  return (
    <Flexbox flex='1' flexDirection='column'>
      {children}
    </Flexbox>
  );
};
