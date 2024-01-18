import emotionStyled from '@emotion/styled';

export const Label = emotionStyled.label<{ flexDirection?: string }>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection ?? 'column'};
  margin-bottom: 15px;
  .MuiSwitch-thumb {
    color: unset;
  }
`;
