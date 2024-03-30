'use client';

import React, { Suspense, useEffect, useState } from 'react';
import LocaleSwitcher from './LocaleSwitcher';
import styled from '@emotion/styled';
import { ProfileMenu } from './ProfileMenu/ProfileMenu';
import { useUserSession } from '../../contexts/auth/hooks/useUserSession';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/pro-light-svg-icons';
import { navRoutes } from './routes';
import { useLocale, useTranslations } from 'next-intl';
import { Flexbox } from '../commons/Flexbox';
import { NavigationLink } from '../commons/NavigationLink';
import { usePathname } from 'next/navigation';
import { CartMenu } from './CartMenu';
import { Logo } from './Logo';
import Slogan from './Slogan';
import ResponsiveMenu from './ResponsiveMenu/ResponsiveMenu';
// import GlobalSearch from './GlobalSearch';

const Root = styled.header<{ isScrolled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isScrolled }) =>
    isScrolled ? 'var(--primary-color)' : 'transparent'};
  position: fixed;
  transition: background-color 150ms ease;
  left: 0;
  top: 0;
  right: 0;
  z-index: 300;
  padding: 20px 20px;
  padding-right: 30px;
  @media (max-width: 768px) {
    padding: 20px;
    justify-content: flex-start;
  }
`;

const LogoSloganWrapper = styled(Flexbox)`
  @media (max-width: 768px) {
    flex-direction: column;
    flex: 1;
    justify-content: center;
    align-items: center;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  flex: 1;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ListRoute = styled.ul`
  display: flex;
  flex: 1;
  justify-content: flex-end;
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

export const Navbar = () => {
  useUserSession();
  const t = useTranslations();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = (event: any) => {
    if (event.currentTarget.scrollTop > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    const mainPage = document.getElementById('page-layout');
    if (mainPage) {
      mainPage.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (mainPage) {
        mainPage.removeEventListener('scroll', handleScroll);
      }
    };
  }, [pathname]);

  const locale = useLocale();

  return (
    <Root isScrolled={isScrolled}>
      <ResponsiveMenu>
        <LogoSloganWrapper alignItems='flex-end'>
          <Logo />
          <Slogan />
        </LogoSloganWrapper>
        <div style={{ width: '40px' }} />
      </ResponsiveMenu>
      {isScrolled ? (
        <>
          <LogoSloganWrapper alignItems='flex-end'>
            <Logo />
            <Slogan />
          </LogoSloganWrapper>
          <div style={{ width: '40px' }} />
        </>
      ) : null}

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
          {/* <GlobalSearch /> */}
          <Suspense
            fallback={
              <i>
                <FontAwesomeIcon icon={faSpinner} className='fa-pulse' />
              </i>
            }>
            <ProfileMenu />
          </Suspense>
          <LocaleSwitcher />
          <CartMenu />
        </ToolbarWrapper>
      </Nav>
    </Root>
  );
};
