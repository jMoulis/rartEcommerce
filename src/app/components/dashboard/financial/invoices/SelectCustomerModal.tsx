import { findAllOnce } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICustomer } from '@/src/types/DBTypes';
import {
  getCoreRowModel,
  createColumnHelper,
  useReactTable
} from '@tanstack/react-table';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import TableDefault from '../../../commons/Layouts/TableDefault';
import { useTranslations } from 'next-intl';
import { Button } from '../../../commons/Buttons/Button';
import { useToggle } from '../../../hooks/useToggle';
import { FullDialog } from '../../../commons/dialog/FullDialog';

const columnHelper = createColumnHelper<ICustomer>();

const columns = [
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (props) => {
      const meta = props.table.options.meta as any;
      return (
        <Button
          className='text-white'
          type='button'
          onClick={() => {
            const onSelect = meta?.onSelect;
            if (typeof onSelect === 'function') {
              onSelect(props.row.original);
            }
          }}>
          Sélectionner
        </Button>
      );
    }
  }),
  columnHelper.display({
    id: 'productName',
    header: 'Désignation',
    cell: (props) => {
      return <span>{props.row.original.companyName}</span>;
    }
  })
];

interface Props {
  onSelectItem: (product: ICustomer) => void;
}

const SelectCustomerModal = ({ onSelectItem }: Props) => {
  const { open, onClose, onOpen } = useToggle();

  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const t = useTranslations();

  const handleSelect = useCallback((customer: ICustomer) => {
    onSelectItem(customer);
    onClose();
  }, []);

  const meta: any = useMemo(() => ({ t, onSelect: handleSelect }), [t]);
  useEffect(() => {
    findAllOnce(ENUM_COLLECTIONS.CUSTOMERS).then((payload) => {
      setCustomers(payload.data || []);
    });
  }, []);

  const table = useReactTable({
    columns,
    data: customers,
    meta,
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <div>
      <Button
        onClick={onOpen}
        style={{
          marginBottom: '10px'
        }}>
        Sélectionner un client
      </Button>
      <FullDialog
        open={open}
        onClose={onClose}
        header={{
          title: 'Sélectionner un client'
        }}>
        <TableDefault table={table} />
      </FullDialog>
    </div>
  );
};

export default SelectCustomerModal;
