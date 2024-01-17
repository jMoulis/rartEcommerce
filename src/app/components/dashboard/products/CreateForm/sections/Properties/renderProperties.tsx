import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { TextareaGroup } from '@/src/app/components/commons/form/TextareaGroup';

export const renderProperties: Record<string, (props: any) => React.ReactNode> =
  {
    INPUT: (props) => <InputGroup {...props} />,
    NUMERIC: (props) => <InputGroup type='number' {...props} />,
    TEXTAREA: (props) => <TextareaGroup {...props} />,
  };
