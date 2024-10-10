'use client';

import { ITemplate } from '@/src/types/DBTypes';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';

interface Props {
  templates: ITemplate[];
}

export const Templates = ({ templates }: Props) => {
  const t = useTranslations('Template');
  const tCommons = useTranslations('commons');
  const data: ITemplate[] = useMemo(() => templates ?? [], []);

  const columnHelper = createColumnHelper<ITemplate>() as any;

  const columns: Array<ColumnDef<any, any>> = [
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

  return (
    <FinderLayoutPage
      columns={columns}
      data={data}
      sectionTitle={t('templates')}
      createLink={{
        href: '/dashboard/templates/create',
        label: t('templates'),
      }}
    />
  );
};
