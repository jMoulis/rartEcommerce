import styled from '@emotion/styled';

export const Label = styled.label<{
  flexDirection?: string;
}>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'column'};
  margin-bottom: 10px;
  margin-right: 5px;
  position: relative;
  @media (max-width: 768px) {
    margin-bottom: 10px;
    flex: 1;
  }
`;
