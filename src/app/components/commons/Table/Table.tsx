'use client';

import { IProductService } from '@/src/types/DBTypes';
import React, { useCallback } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  Header,
  ColumnDef,
} from '@tanstack/react-table';
import {
  Table as TableStyle,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '../../commons/Table/StyledComponents';

interface Props {
  data: any[];
  columns: Array<ColumnDef<any, any>>;
}

export const Table = ({ data, columns }: Props) => {
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
    <TableContainer>
      <TableStyle>
        <Thead>
          {table.getHeaderGroups().map((headerGroup, key) => (
            <Tr key={key}>
              {headerGroup.headers.map((header, headerGroupKey) => (
                <Th key={headerGroupKey}>{renderHeader(header)}</Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row, rowKeyModal) => (
            <Tr key={rowKeyModal}>
              {row.getVisibleCells().map((cell, cellKey) => (
                <Td key={cellKey}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </TableStyle>
    </TableContainer>
  );
};
