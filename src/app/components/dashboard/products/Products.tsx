'use client';

import { IProductService } from '@/src/types/DBTypes';
import React, { useCallback } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  Header,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface User {
  firstName: string;
  lastName: string;
  age: number;
  visits: number;
  progress: number;
  status: string;
}

interface Props {
  products?: IProductService[];
}

export const Products = (props: Props) => {
  const t = useTranslations('Product');

  const data: any = [
    {
      firstName: 'Tanner',
      lastName: 'Linsley',
      age: 33,
      visits: 100,
      progress: 50,
      status: 'Married',
    },
    {
      firstName: 'Kevin',
      lastName: 'Vandy',
      age: 27,
      visits: 200,
      progress: 100,
      status: 'Single',
    },
  ];
  const columnHelper = createColumnHelper<User>() as any;
  const columns = [
    columnHelper.accessor('firstName', {
      cell: (info: any) => info.getValue(),
      footer: (info: any) => info.column.id,
    }),
    columnHelper.accessor((row: any) => row.lastName, {
      id: 'lastName',
      cell: (info: any) => <i>{info.getValue()}</i>,
      header: () => <span>Last Name</span>,
      footer: (info: any) => info.column.id,
    }),
    columnHelper.accessor('age', {
      header: () => 'Age',
      cell: (info: any) => info.renderValue(),
      footer: (info: any) => info.column.id,
    }),
    columnHelper.accessor('visits', {
      header: () => <span>Visits</span>,
      footer: (info: any) => info.column.id,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      footer: (info: any) => info.column.id,
    }),
    columnHelper.accessor('progress', {
      header: 'Profile Progress',
      footer: (info: any) => info.column.id,
    }),
  ];
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderHeader = useCallback((header: Header<unknown, unknown>) => {
    if (header.isPlaceholder) return null;
    return flexRender(header.column.columnDef.header, header.getContext());
  }, []);

  return (
    <section>
      <h1>Products</h1>
      <Link href='/dashboard/products/create'>{t('addProduct')}</Link>
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
    </section>
  );
};
