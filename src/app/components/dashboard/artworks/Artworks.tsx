'use client';

import { IArtwork } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';
import { useTranslations } from 'next-intl';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { createColumnHelper } from '@tanstack/react-table';
import Link from 'next/link';
import Image from 'next/image';

interface Props {
  initialArtworks: IArtwork[];
  shouldSubscribe: boolean;
}
const columnHelper = createColumnHelper<IArtwork>() as any;

export const Artworks = ({ initialArtworks, shouldSubscribe }: Props) => {
  const [artworks, setOrders] = useState<IArtwork[]>(initialArtworks);
  const t = useTranslations();

  const columns = [
    columnHelper.accessor((row: any) => row._id, {
      id: 'images',
      header: () => <span></span>,
      cell: (info: any) => {
        const [image] = info.row.original.images;
        const name = info.row.original.name;
        if (!image) return <span>No image</span>;
        return (
          <Image
            alt={name}
            height={30}
            width={30}
            src={image?.url}
            style={{
              objectFit: 'cover',
            }}
          />
        );
      },
    }),
    columnHelper.accessor((row: any) => row._id, {
      id: '_id',
      header: () => <span>Name</span>,
      cell: (info: any) => {
        const id = info.row.original._id;
        return (
          <Link href={`${ENUM_ROUTES.ARTWORKS_DETAIL}/${id}`}>
            <span
              style={{
                textDecoration: 'underline',
              }}>
              {info.row.original.name}
            </span>
          </Link>
        );
      },
    }),

    columnHelper.accessor((row: any) => row._id, {
      id: 'pusblished',
      header: () => <span>Published</span>,
      cell: (info: any) => {
        const status = info.row.original.published;
        return <input type='checkbox' disabled checked={status} />;
      },
    }),
  ];
  useEffect(() => {
    if (!shouldSubscribe) return;
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.ARTWORKS,
      (payload) => {
        setOrders(payload);
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
  return (
    <FinderLayoutPage
      sectionTitle={t('Dashboard.artworks')}
      data={artworks}
      columns={columns}
      createLink={{
        label: t('Artwork.create'),
        href: ENUM_ROUTES.ARTWORKS_CREATE,
      }}
    />
  );
};
