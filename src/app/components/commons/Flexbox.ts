import emotionStyled from '@emotion/styled';

export const Flexbox = emotionStyled.div<{ flexDirection?: string; justifyContent?: string; alignItems?: string; flex?: string; flexWrap?: string }>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  justify-content: ${({ justifyContent }) => justifyContent};
  align-items: ${({ alignItems }) => alignItems};
  flex-wrap: ${({ flexWrap }) => flexWrap};
  flex: ${({ flex }) => flex};
`;
