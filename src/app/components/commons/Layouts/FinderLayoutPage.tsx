'use client';

import React, { ReactNode } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  ColumnDef,
} from '@tanstack/react-table';
import Link from 'next/link';
import { SectionTitle } from '../../commons/Layouts/SectionTitle';
import styled from '@emotion/styled';
import { Flexbox } from '../Flexbox';
import TableDefault from './TableDefault';

const Root = styled.div`
  label: FinderLayoutRoot;
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  max-height: 80vh;
  overflow: hidden;
`;

const CustomLink = styled(Link)`
  padding: 5px 15px;
  border-radius: 18px;
  width: fit-content;
  background-color: var(--primary-color);
  display: flex;
  cursor: pointer;
  font-size: 15px;
  color: #fff;
  align-items: center;
  transition: background-color 150ms ease;
  margin: 0 20px;
  text-decoration: none;
  & * {
    color: #fff;
  }
  &:hover {
    background-color: #4eb7f5;
  }
`;

interface Props {
  data: any[];
  columns: Array<ColumnDef<any, any>>;
  sectionTitle: string;
  headerChildren?: ReactNode;
  createLink?: {
    href: string;
    label: string;
  };
}

export const FinderLayoutPage = ({
  data,
  columns,
  sectionTitle,
  createLink,
  headerChildren,
}: Props) => {
  const table = useReactTable({
    columns,
    data,
    state: {
      columnVisibility: {
        id: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Root>
      <Flexbox alignItems='center' justifyContent='space-between'>
        <SectionTitle>{sectionTitle}</SectionTitle>
        {createLink ? (
          <Flexbox alignItems='center'>
            <CustomLink href={createLink.href}>{createLink.label}</CustomLink>
            {headerChildren}
          </Flexbox>
        ) : null}
      </Flexbox>
      <TableDefault table={table} />
    </Root>
  );
};
