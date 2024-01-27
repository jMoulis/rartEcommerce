import React from 'react';
import { INavigationRoute } from '../navbar/types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from '@emotion/styled';
import { Flexbox } from '../commons/Flexbox';
import { Collapse } from '@mui/material';
import { useToggle } from '../hooks/useToggle';
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/pro-light-svg-icons';

const Root = styled.li``;
const OpenCollapseButton = styled.button`
  display: flex;
  padding: 10px;
  justify-content: space-between;
  margin: 0 5px;
  border-radius: 5px;
  &:hover {
    background-color: rgba(57, 237, 205, 0.2);
  }
`;

const CustomLink = styled(Link)<{ open: boolean }>`
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  margin: 0;
  padding: 10px;
  font-size: 15px;
  border-radius: 5px;
  text-decoration: none;
  &:hover {
    background-color: rgba(57, 237, 205, 0.2);
  }
  & .link-text {
    font-size: 15px;
    white-space: nowrap;
    opacity: ${({ open }) => (open ? 1 : 0)};
    transition: opacity 150ms ease;
  }
`;
const Sublist = styled.ul`
  margin: 0 5px;
  border-radius: 5px;
  background-color: rgba(57, 237, 205, 0.12);
`;

interface Props {
  label: string;
  routes: INavigationRoute[];
  className?: string;
  open: boolean;
}

export const DashboardNavigationLink = ({
  routes,
  className,
  open,
  label,
}: Props) => {
  const { open: collapseOpen, onToggle } = useToggle();

  return (
    <Root style={{ display: 'flex', flexDirection: 'column' }}>
      <OpenCollapseButton onClick={onToggle} type='button'>
        {label}
        <FontAwesomeIcon icon={collapseOpen ? faChevronDown : faChevronRight} />
      </OpenCollapseButton>
      <Collapse in={collapseOpen}>
        <Sublist>
          {routes.map((route, key) => (
            <li key={key}>
              <CustomLink href={route.href} className={className} open={open}>
                <Flexbox justifyContent='flex-start'>
                  <p className='link-text'>{route.label}</p>
                </Flexbox>
              </CustomLink>
            </li>
          ))}
        </Sublist>
      </Collapse>
    </Root>
  );
};
