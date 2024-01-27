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
import { useLocale, useTranslations } from 'next-intl';
import { Flexbox } from '../commons/Flexbox';
import { NavigationLink } from '../commons/NavigationLink';
import { Logo } from './Logo';
import { usePathname } from 'next/navigation';

const Root = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--primary-color);
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  z-index: 300;
  padding: 20px 20px;
  padding-right: 10px;
  @media (max-width: 768px) {
    padding: 20px 10px 20px 20px;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  padding: 0;
`;

const ListRoute = styled.ul`
  display: flex;
  @media (max-width: 768px) {
    display: none;
  }
`;
const ToolbarWrapper = styled(Flexbox)`
  display: flex;
  @media (max-width: 768px) {
    display: none;
  }
`;

interface Props {
  current: { profile: UserProfile; user: User } | null;
}
export const Navbar = ({ current }: Props) => {
  useUserSession(current);
  const t = useTranslations();
  const pathname = usePathname();

  const locale = useLocale();
  return (
    <Root>
      <Logo />
      <Nav>
        <ListRoute>
          {navRoutes(t).map((route, key) => {
            const isRootRoute = route.href === '/';
            const checkedUrl = isRootRoute
              ? `/${locale}`
              : `/${locale}${route.href}`;
            return (
              <NavigationLink
                active={pathname === checkedUrl}
                key={key}
                route={route}
              />
            );
          })}
        </ListRoute>
        <ToolbarWrapper alignItems='center'>
          <LocaleSwitcher />
          <Suspense
            fallback={
              <i>
                <FontAwesomeIcon icon={faSpinner} className='fa-pulse' />
              </i>
            }>
            <ProfileMenu />
          </Suspense>
        </ToolbarWrapper>
      </Nav>
    </Root>
  );
};
