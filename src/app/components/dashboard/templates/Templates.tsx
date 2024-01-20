'use client';

import { ITemplate } from '@/src/types/DBTypes';
import {
  Header,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useCallback, useMemo } from 'react';

interface Props {
  templates: ITemplate[];
}

export const Templates = ({ templates }: Props) => {
  const t = useTranslations('Template');
  const tCommons = useTranslations('commons');
  const data: ITemplate[] = useMemo(() => templates ?? [], []);

  const columnHelper = createColumnHelper<ITemplate>() as any;

  const columns = [
    columnHelper.accessor((row: any) => row.id, {
      id: 'id',
      header: () => <span />,
      cell: (info: any) => <span />,
    }),
    columnHelper.accessor((row: any) => row.title, {
      id: 'title',
      header: () => <span>{tCommons('name')}</span>,
      cell: (info: any) => {
        const id = info.row.original._id;
        return (
          <Link href={`/dashboard/templates/${id}`}>{info.getValue()}</Link>
        );
      },
    }),
  ];
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

  const renderHeader = useCallback((header: Header<ITemplate, unknown>) => {
    if (header.isPlaceholder) return null;
    return flexRender(header.column.columnDef.header, header.getContext());
  }, []);

  return (
    <div>
      Templates
      <Link href='/dashboard/templates/create'>{t('createTemplate')}</Link>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>{renderHeader(header)}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
