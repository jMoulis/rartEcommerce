'use client';

import React from 'react';
import { dashboardRoutes } from './routes';
import { useTranslations } from 'next-intl';
import { DashboardNavigationLink } from './DashboardNavigationLink';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { useToggle } from '../hooks/useToggle';
import { Flexbox } from '../commons/Flexbox';
import { Button } from '../commons/Buttons/Button';

const ListMenu = styled.ul`
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    overflow-y: auto;
    background-color: #fff;
    height: 50px;
  }
`;

const Root = styled.aside<{ open: boolean }>`
  width: ${({ open }) => (open ? '175px' : '50px')};
  transition: width 150ms ease-in;
  min-width: 60px;
  overflow: hidden;
  padding-top: 20px;
  background-color: #fff;
  grid-area: menu;
`;

export const Menu = () => {
  const { onToggle, open } = useToggle(true);

  const t = useTranslations();
  return (
    <Root open={open}>
      <Flexbox justifyContent={open ? 'flex-end' : 'center'}>
        <Button
          type='button'
          onClick={onToggle}
          style={{
            transition: 'transform 150ms ease',
            transform: open ? 'rotate(180deg)' : 'rotate(360deg)',
            fontSize: '20px',
          }}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </Flexbox>
      <ListMenu>
        {dashboardRoutes(t).map((section, key) => (
          <DashboardNavigationLink
            label={section.label}
            routes={section.menus}
            key={key}
            open={open}
          />
        ))}
      </ListMenu>
    </Root>
  );
};

export default Menu;
