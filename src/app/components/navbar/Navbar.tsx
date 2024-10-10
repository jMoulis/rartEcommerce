'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useUserSession } from '../../contexts/auth/hooks/useUserSession';
import { navRoutes } from './routes';
import { useLocale, useTranslations } from 'next-intl';
import { NavigationLink } from '../commons/NavigationLink';
import { usePathname } from 'next/navigation';
import { CartMenu } from './CartMenu';
import ResponsiveMenu from './ResponsiveMenu/ResponsiveMenu';
import { LanguageProfileMenu } from './LanguageProfileMenu';
import { MainNavHeader } from './MainNavHeader';
import { ResponsiveWrapper } from './ResponsiveWrapper';

const Root = styled.header<{ isScrolled: boolean }>`
  position: sticky;
  min-height: 60px;
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
  padding: 10px;
  padding-right: 30px;
  @media (max-width: 768px) {
    padding: 20px;
    justify-content: flex-start;
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

export const Navbar = () => {
  useUserSession();
  const t = useTranslations();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const headerRef = useRef<HTMLHeadElement>(null);

  const handleScroll = () => {
    if (window.scrollY > (headerRef?.current as any)?.offsetTop) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const locale = useLocale();

  return (
    <Root ref={headerRef} isScrolled={isScrolled}>
      <ResponsiveMenu isScrolled={isScrolled} />
      {isScrolled ? (
        <>
          <MainNavHeader />
          <ResponsiveWrapper>
            <CartMenu isScrolled={isScrolled} />
          </ResponsiveWrapper>
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
        <LanguageProfileMenu isScrolled={isScrolled} withCart />
      </Nav>
    </Root>
  );
};
