import styled from '@emotion/styled';

export const AlignButton = styled.button<{ selected: boolean }>`
  background-color: ${({ selected }) =>
    selected ? 'var(--primary-color)' : 'var(--cancel-color)'};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
