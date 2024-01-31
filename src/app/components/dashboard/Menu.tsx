'use client';

import React from 'react';
import { dashboardRoutes } from './routes';
import { useTranslations } from 'next-intl';
import { DashboardNavigationLink } from './DashboardNavigationLink';
import styled from '@emotion/styled';
import { faChevronRight } from '@fortawesome/pro-light-svg-icons';
import { useToggle } from '../hooks/useToggle';
import { Flexbox } from '../commons/Flexbox';
import { IconButton } from '../commons/Buttons/IconButton';

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
  width: ${({ open }) => (open ? '200px' : '50px')};
  transition: width 150ms ease-in;
  border-top-right-radius: 10px;
  min-width: 60px;
  overflow: hidden;
  background-color: #fff;
  grid-area: menu;
`;

export const Menu = () => {
  const { onToggle, open } = useToggle(true);

  const t = useTranslations();
  return (
    <Root open={open}>
      <Flexbox
        justifyContent={open ? 'flex-end' : 'center'}
        style={{
          padding: '10px',
          paddingBottom: '5px',
          borderBottom: '1px solid var(--card-header-border-color)',
        }}>
        <IconButton
          icon={faChevronRight}
          onClick={onToggle}
          style={{
            transition: 'transform 150ms ease',
            backgroundColor: 'transparent',
            color: 'var(--default-font-color) !important',
            transform: open ? 'rotate(180deg)' : 'rotate(360deg)',
            fontSize: '20px',
          }}
        />
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
