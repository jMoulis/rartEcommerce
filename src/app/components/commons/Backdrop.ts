import styled from '@emotion/styled';

export const Backdrop = styled.div<{ backgroundColor?: string, open?: boolean, radius?: string }>`
  position: absolute;
  display: ${({ open }) => open ? 'flex' : 'none'};
  top: -20px;
  bottom: -20px;
  right: -20px;
  left: -20px;
  background-color: ${({ backgroundColor }) => backgroundColor ?? 'rgba(0,0,0,0.3)'};
  z-index: 1;
  border-radius: ${({ radius }) => radius};
`;
