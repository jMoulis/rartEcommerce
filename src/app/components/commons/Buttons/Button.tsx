import styled from '@emotion/styled';

export const Button = styled.button<{
  backgroundColor?: string;
  hoverBackgroundColor?: string;
}>`
  padding: 5px 15px;
  border-radius: var(--default-button-radius);
  width: fit-content;
  background-color: ${({ backgroundColor }) =>
    backgroundColor ?? 'var(--primary-color)'};
  display: flex;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  align-items: center;
  transition: background-color 150ms ease;
  margin: 0 5px;
  color: #fff;
  &:hover {
    background-color: ${({ hoverBackgroundColor }) =>
      hoverBackgroundColor ?? '#4eb7f5'};
  }
  &:disabled {
    background-color: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.8);
    cursor: not-allowed;
  }
  white-space: nowrap;
`;
