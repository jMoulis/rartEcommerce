import styled from '@emotion/styled';

export const Label = styled.label<{
  flexDirection?: string;
}>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'column'};
  margin-bottom: 15px;
  position: relative;
`;
