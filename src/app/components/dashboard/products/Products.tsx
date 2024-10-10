'use client';

import { IProductService } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';

interface Props {
  initialProducts: IProductService[];
}

export const Products = ({ initialProducts }: Props) => {
  const t = useTranslations();
  const tProductForm = useTranslations('ProductForm');
  const [data, setData] = useState<IProductService[]>(initialProducts);

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.PRODUCTS,
      (payload) => {
        setData(payload);
      },
      (error) => {
        toast.error(error.message);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);
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
        const id = info.row.original._id;
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

  return (
    <FinderLayoutPage
      data={data}
      columns={columns}
      sectionTitle={t('Dashboard.products')}
      createLink={{
        href: '/dashboard/products/create',
        label: t('Product.addProduct'),
      }}
    />
  );
};
