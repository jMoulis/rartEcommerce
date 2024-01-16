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
  padding: 5px 10px;
  justify-content: space-between;
  &:hover {
    background-color: gray;
  }
`;

const CustomLink = styled(Link)<{ open: boolean }>`
  display: grid;
  grid-template-columns: 30px 1fr;
  align-items: center;
  margin: 10px 0;
  padding: 5px;
  font-size: 15px;
  &:hover {
    background-color: gray;
  }
  & .link-text {
    font-size: 15px;
    white-space: nowrap;
    opacity: ${({ open }) => (open ? 1 : 0)};
    transition: opacity 150ms ease;
  }
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
        <ul>
          {routes.map((route, key) => (
            <li key={key}>
              <CustomLink href={route.href} className={className} open={open}>
                <Flexbox justifyContent='center'>
                  <FontAwesomeIcon icon={route.icon} />
                </Flexbox>
                <Flexbox justifyContent='flex-start'>
                  <p className='link-text'>{route.label}</p>
                </Flexbox>
              </CustomLink>
            </li>
          ))}
        </ul>
      </Collapse>
    </Root>
  );
};
