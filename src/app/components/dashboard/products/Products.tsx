'use client';

import { IProductService } from '@/src/types/DBTypes';
import React, { useCallback, useMemo } from 'react';
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  Header,
} from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Props {
  products?: IProductService[];
}

export const Products = ({ products }: Props) => {
  const t = useTranslations('Product');
  const tProductForm = useTranslations('ProductForm');
  const data: IProductService[] = useMemo(() => products ?? [], []);

  const columnHelper = createColumnHelper<IProductService>() as any;

  const columns = [
    columnHelper.accessor((row: any) => row.id, {
      id: 'id',
      header: () => <span />,
      cell: (info: any) => <span />,
    }),
    columnHelper.accessor((row: any) => row.images, {
      id: 'id',
      header: () => <span />,
      cell: (info: any) => {
        return <span />;
      },
    }),
    columnHelper.accessor((row: any) => row.name, {
      id: 'name',
      header: () => <span>{tProductForm('name')}</span>,
      cell: (info: any) => {
        const id = info.row.original.id;
        console.log(id);
        return (
          <Link href={`/dashboard/products/${id}`}>{info.getValue()}</Link>
        );
      },
    }),
    columnHelper.accessor('category', {
      id: 'category',
      header: () => <span>{tProductForm('category')}</span>,
      cell: (info: any) => <i>{info.getValue()}</i>,
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

  const renderHeader = useCallback(
    (header: Header<IProductService, unknown>) => {
      if (header.isPlaceholder) return null;
      return flexRender(header.column.columnDef.header, header.getContext());
    },
    []
  );

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
