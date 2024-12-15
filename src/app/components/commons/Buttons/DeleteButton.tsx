import styled from '@emotion/styled';
import { Button } from './Button';

export const DeleteButton = styled(Button)`
  background-color: var(--error-color);
  &:hover {
    background-color: var(--error-color-hover);
  }
`;
