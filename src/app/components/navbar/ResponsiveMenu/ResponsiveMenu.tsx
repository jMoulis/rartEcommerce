import React from 'react';
import styled from '@emotion/styled';
import { Button } from '../../commons/Buttons/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/pro-light-svg-icons';
import { useToggle } from '../../hooks/useToggle';
import { SwipeableDrawer } from '@mui/material';
import { navRoutes } from '../routes';
import { useLocale, useTranslations } from 'next-intl';
import { NavigationLink } from '../../commons/NavigationLink';
import { usePathname } from 'next/navigation';
import { LanguageProfileMenu } from '../LanguageProfileMenu';
import { MainNavHeader } from '../MainNavHeader';

const Root = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
  }
`;
const Header = styled.header`
  display: flex;
  padding: 20px;
  background-color: var(--primary-color);
`;
const Nav = styled.nav`
  @media (max-width: 768px) {
    width: 100vw;
    flex: 1;
    background-color: rgba(0, 145, 197, 1);
  }
`;
const Links = styled.ul``;
const Route = styled.li`
  margin: 10px 0;
  & * {
    font-size: 25px;
  }
`;

const CustomButton = styled(Button)`
  padding: 0;
  margin: 0;
  margin-right: 10px;
  background-color: transparent;
  &:hover {
    background-color: transparent;
  }
`;

interface Props {
  isScrolled: boolean;
}
const ResponsiveMenu = ({ isScrolled }: Props) => {
  const { open, onClose, onOpen } = useToggle();
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <>
      <Root>
        <CustomButton onClick={onOpen}>
          <FontAwesomeIcon icon={faBars} size='2x' />
        </CustomButton>
        <SwipeableDrawer
          keepMounted={false}
          open={open}
          onClose={onClose}
          onOpen={onOpen}>
          <Nav>
            <Header>
              <CustomButton onClick={onClose}>
                <FontAwesomeIcon icon={faXmark} size='2x' />
              </CustomButton>
              <MainNavHeader />
            </Header>
            <Links>
              {navRoutes(t).map((route, key) => {
                const isRootRoute = route.href === '/';
                const checkedUrl = isRootRoute
                  ? `/${locale}`
                  : `/${locale}${route.href}`;

                return (
                  <Route key={key} onClick={onClose}>
                    <NavigationLink
                      route={route}
                      active={pathname === checkedUrl}
                    />
                  </Route>
                );
              })}
            </Links>
            <LanguageProfileMenu withCart={false} isScrolled={isScrolled} />
          </Nav>
        </SwipeableDrawer>
      </Root>
    </>
  );
};

export default ResponsiveMenu;
