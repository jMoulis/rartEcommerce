import React from 'react';
import { INavigationRoute } from '../navbar/types';
import Link from 'next/link';
import styled from '@emotion/styled';

const CustomLink = styled(Link)`
  display: grid;
  grid-template-columns: 30px 1fr;
  & .link-text {
    white-space: nowrap;
  }
`;
interface Props {
  route: INavigationRoute;
  className?: string;
}

export const NavigationLink = ({ route, className }: Props) => {
  return (
    <li>
      <CustomLink href={route.href} className={className}>
        <p className='link-text'>{route.label}</p>
      </CustomLink>
    </li>
  );
};
