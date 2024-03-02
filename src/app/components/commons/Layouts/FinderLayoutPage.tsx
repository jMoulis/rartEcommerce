'use client';

import { IProductService } from '@/src/types/DBTypes';
import React, { ReactNode, useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Header,
  ColumnDef,
} from '@tanstack/react-table';
import Link from 'next/link';
import { SectionTitle } from '../../commons/Layouts/SectionTitle';
import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '../../commons/Table/StyledComponents';
import styled from '@emotion/styled';
import { Flexbox } from '../Flexbox';

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
  createLink: {
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

  const renderHeader = useCallback(
    (header: Header<IProductService, unknown>) => {
      if (header.isPlaceholder) return null;
      return flexRender(header.column.columnDef.header, header.getContext());
    },
    []
  );

  return (
    <Root>
      <Flexbox alignItems='center' justifyContent='space-between'>
        <SectionTitle>{sectionTitle}</SectionTitle>
        <Flexbox alignItems='center'>
          <CustomLink href={createLink.href}>{createLink.label}</CustomLink>
          {headerChildren}
        </Flexbox>
      </Flexbox>
      <TableContainer>
        <Table>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>{renderHeader(header)}</Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Root>
  );
};
