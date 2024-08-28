import React, { useCallback } from 'react';
import {
  Table as TableStyled,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '../Table/StyledComponents';
import { Table, flexRender, Header } from '@tanstack/react-table';
interface Props {
  table: Table<any>;
}

const TableDefault = ({ table }: Props) => {
  const renderHeader = useCallback((header: Header<any, unknown>) => {
    if (header.isPlaceholder) return null;
    return flexRender(header.column.columnDef.header, header.getContext());
  }, []);

  return (
    <TableContainer>
      <TableStyled>
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>{renderHeader(header)}</Th>
                ))}
              </Tr>
            );
          })}
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
      </TableStyled>
    </TableContainer>
  );
};

export default TableDefault;
