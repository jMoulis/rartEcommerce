import Link from 'next/link';
import styled from '@emotion/styled';
import { propsToForward } from '@/src/lib/utils/main';

interface ButtonLinkProps {
  hoverBackgroundColor?: string;
  backgroundColor?: string;
}
export const ButtonLink = styled(Link, {
  shouldForwardProp: (props) =>
    propsToForward(props, ['backgroundColor', 'hoverBackgroundColor']),
})<ButtonLinkProps>`
  padding: 0px;
  width: fit-content;
  display: flex;
  cursor: pointer;
  font-size: 16px;
  border-bottom: 1px solid transparent;
  color: ${({ backgroundColor }) => backgroundColor ?? 'var(--primary-color)'};
  align-items: center;
  transition: all 150ms ease;
  margin: 0 5px;
  &:hover {
    border-bottom: 1px solid
      ${({ backgroundColor }) => backgroundColor ?? 'var(--primary-color)'};
  }
  & * {
    color: ${({ backgroundColor }) =>
      backgroundColor ?? 'var(--primary-color)'};
  }
  &:disabled {
    background-color: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.8);
    cursor: not-allowed;
  }
  white-space: nowrap;
  @media (max-width: 768px) {
    margin: 10px 0;
    width: unset;
    justify-content: center;
    padding: 10px 20px;
  }
`;
export const ButtonAnchorLink = styled.a`
  padding: 5px 15px;
  border-radius: 18px;
  width: fit-content;
  background-color: var(--primary-color);
  display: flex;
  cursor: pointer;
  font-size: 16px;
  color: #fff;
  align-items: center;
  transition: background-color 150ms ease;
  margin: 0 5px;
  color: #fff;
  &:hover {
    background-color: #4eb7f5;
  }
  &:disabled {
    background-color: rgba(0, 0, 0, 0.3);
    color: rgba(255, 255, 255, 0.8);
    cursor: not-allowed;
  }
  white-space: nowrap;
`;
