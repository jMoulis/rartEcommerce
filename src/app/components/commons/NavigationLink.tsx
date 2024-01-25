import React from 'react';
import { INavigationRoute } from '../navbar/types';
import Link from 'next/link';
import styled from '@emotion/styled';

const Root = styled.div<{ activelink: boolean }>`
  display: flex;
  align-items: center;
  white-space: nowrap;
  border-width: 1px;
  border-style: solid;
  box-shadow: none;
  background-color: ${({ activelink }) =>
    activelink ? 'var(--primary-accent)' : 'transparent'};
  color: ${({ activelink }) =>
    activelink ? 'var(--default-font-color)' : 'var(--white)'};
  border-radius: 8px;
  border-color: ${({ activelink }) =>
    activelink ? 'var(--primary-accent)' : 'var(--white)'};);
  font-size: 17px;
  padding: 3px 10px;
  font-weight: var(--font-weight-body);
  line-height: 1.75rem;
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
  margin-right: 10px;

  &:hover {
    background-color: var(--primary-accent);
    color: var(--default-font-color);
    border: 1px solid var(--primary-accent);
  }
`;
interface Props {
  route: INavigationRoute;
  className?: string;
  active: boolean;
}

export const NavigationLink = ({ route, className, active }: Props) => {
  return (
    <Root activelink={active}>
      <Link href={route.href} className={className}>
        {route.label}
      </Link>
    </Root>
  );
};
