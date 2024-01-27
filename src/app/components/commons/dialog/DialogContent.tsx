import styled from '@emotion/styled';

export const DialogContentWrapper = styled.div<{ height?: string }>`
  display: flex;
  flex-direction: column;
  height: ${({ height }) => height ?? '50vh'};
  min-height: ${({ height }) => height ?? '50vh'};
  overflow: auto;
  padding: 20px;
  flex: 1;
  background-color: var(--background-section-color);
`;
export const DialogContent = styled.div<{ height?: string }>`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
`;
