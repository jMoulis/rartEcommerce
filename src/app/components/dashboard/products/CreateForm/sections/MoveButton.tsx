import { Button } from '@/src/app/components/commons/Buttons/Button';
import styled from '@emotion/styled';

export const MoveButton = styled(Button)`
  background-color: var(--purple-color);
  &:disabled {
    background-color: var(--disabled-color);
  }
`;
