'use client';

import React, { Suspense } from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import styled from '@emotion/styled';
import { ProfileMenu } from './ProfileMenu/ProfileMenu';
import { useUserSession } from '../../contexts/auth/hooks/useUserSession';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { UserProfile } from '@/src/types/DBTypes';
import { User } from 'firebase/auth';
import { navRoutes } from './routes';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../commons/Flexbox';
import { NavigationLink } from '../commons/NavigationLink';

const Root = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #eaeaea;
`;

const Nav = styled.nav`
  display: flex;
  height: 50px;
  align-items: center;
`;

interface Props {
  current: { profile: UserProfile; user: User } | null;
}
export const Navbar = ({ current }: Props) => {
  useUserSession(current);
  const t = useTranslations();

  return (
    <Root>
      <Nav>
        <ul>
          {navRoutes(t).map((route, key) => (
            <NavigationLink key={key} route={route} />
          ))}
        </ul>
      </Nav>
      <Flexbox alignItems='center'>
        <LocaleSwitcher />
        <Suspense
          fallback={
            <i>
              <FontAwesomeIcon icon={faSpinner} className='fa-pulse' />
            </i>
          }>
          <ProfileMenu />
        </Suspense>
      </Flexbox>
    </Root>
  );
};
