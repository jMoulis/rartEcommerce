import React from 'react';
import { INavigationRoute } from '../navbar/types';
import Link from 'next/link';
import styled from '@emotion/styled';

const Root = styled(Link)<{ activelink: string }>`
  display: flex;
  align-items: center;
  background-color: transparent;
  color: var(--white);
  padding: 3px 10px;
  padding: 8px 15px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 0.15s;
  margin-right: 10px;
  white-space: nowrap;
  text-decoration: ${({ activelink }) =>
    activelink === 'true' ? 'underline' : 'none'};
  text-underline-offset: 6px; // Add space between underline and text
  font-weight: var(--font-weight-heading);
  font-size: var(--default-font-size);
  &:hover {
    text-decoration: underline;
    text-underline-offset: 6px; // Add space between underline and text
  }
`;
interface Props {
  route: INavigationRoute;
  className?: string;
  active: boolean;
}

export const NavigationLink = ({ route, className, active }: Props) => {
  return (
    <Root
      activelink={active.toString()}
      href={route.href}
      className={className}>
      {route.label}
    </Root>
  );
};
