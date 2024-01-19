import styled from '@emotion/styled';

export const DialogContent = styled.div<{ height?: string }>`
  display: flex;
  flex-direction: column;
  height: ${({ height }) => height ?? '50vh'};
  min-height: ${({ height }) => height ?? '50vh'};
  overflow: auto;
  padding: 20px;
  flex: 1;
`;
