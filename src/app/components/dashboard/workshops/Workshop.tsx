'use client';

import { IWorkshop } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { FinderLayoutPage } from '../../commons/Layouts/FinderLayoutPage';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { IconButton } from '../../commons/Buttons/IconButton';
import { faCalendar } from '@fortawesome/pro-light-svg-icons';
import { useToggle } from '../../hooks/useToggle';
import { FullDialog } from '../../commons/dialog/FullDialog';
import { CalendarApp } from './Calendar';
import { ENUM_DASHBOARD_MENU_ROUTES } from '../routes';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';

interface Props {
  initialWorkshops: IWorkshop[];
}

export default function Workshops({ initialWorkshops }: Props) {
  const [data, setData] = useState(initialWorkshops);
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.WORKSHOPS,
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

  const handleOpenCalendar = () => {
    onOpen();
  };
  const columnHelper = createColumnHelper<IWorkshop>() as any;

  const columns: Array<ColumnDef<any, any>> = [
    columnHelper.accessor((row: any) => row.id, {
      id: 'id',
      header: () => <span />,
      cell: (info: any) => <span />,
    }),

    columnHelper.accessor((row: any) => row.name, {
      id: 'name',
      header: () => <span>{t('commons.name')}</span>,
      cell: (info: any) => {
        const id = info.row.original._id;
        return (
          <Link href={`${ENUM_DASHBOARD_MENU_ROUTES.WORKSHOPS}/${id}`}>
            {info.getValue()}
          </Link>
        );
      },
    }),
  ];

  return (
    <>
      <FinderLayoutPage
        data={data}
        columns={columns}
        sectionTitle={t('Workshop.workshop')}
        createLink={{
          label: t('Workshop.createWorkshop'),
          href: ENUM_DASHBOARD_MENU_ROUTES.WORKSHOPS_CREATE,
        }}
        headerChildren={
          <IconButton icon={faCalendar} onClick={handleOpenCalendar} />
        }
      />
      <FullDialog
        onClose={onClose}
        open={open}
        dialog={{
          maxWidth: 'lg',
          fullWidth: true,
        }}
        header={{
          title: t('Workshop.workshops'),
        }}>
        <CalendarApp />
      </FullDialog>
    </>
  );
}
