import { findAllOnce } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ILineItem, IProductService } from '@/src/types/DBTypes';
import {
  getCoreRowModel,
  createColumnHelper,
  useReactTable
} from '@tanstack/react-table';
import React, { useEffect, useState, useMemo } from 'react';
import TableDefault from '../../../commons/Layouts/TableDefault';
import { useTranslations } from 'next-intl';
import { Button } from '../../../commons/Buttons/Button';

const columnHelper = createColumnHelper<IProductService>();

const columns = [
  columnHelper.display({
    id: 'actions',
    header: 'Actions',
    cell: (props) => {
      const meta = props.table.options.meta as any;
      const selectedData = meta.selectedData || [];
      const isSelected = selectedData.some(
        (item: ILineItem) => item.itemId === props.row.original._id
      );
      return (
        <Button
          className='text-white'
          style={{
            backgroundColor: isSelected && 'rgb(239 68 68)'
          }}
          type='button'
          onClick={() => {
            const onSelect = meta?.onSelect;
            if (typeof onSelect === 'function') {
              onSelect(props.row.original, isSelected);
            }
          }}>
          {isSelected ? 'Déselectionner' : 'Sélectionner'}
        </Button>
      );
    }
  }),
  columnHelper.display({
    id: 'productName',
    header: 'Désignation',
    cell: (props) => {
      return <span>{props.row.original.name}</span>;
    }
  }),
  columnHelper.display({
    id: 'price',
    header: 'Prix',
    cell: (props) => {
      return <span>{props.row.original.price}</span>;
    }
  })
];

interface Props {
  onSelectItem: (product: IProductService, remove: boolean) => void;
  selectedLineItems: ILineItem[];
  collection: ENUM_COLLECTIONS;
}

const WorkshopList = ({
  onSelectItem,
  selectedLineItems,
  collection
}: Props) => {
  const [workshops, setWorkshops] = useState<IProductService[]>([]);
  const t = useTranslations();

  const meta: any = useMemo(
    () => ({
      t,
      onSelect: onSelectItem,
      selectedData: selectedLineItems
    }),
    [t, selectedLineItems]
  );
  useEffect(() => {
    findAllOnce(collection).then((products) => {
      setWorkshops(products.data || []);
    });
  }, [collection]);

  const table = useReactTable({
    columns,
    data: workshops,
    meta,
    getCoreRowModel: getCoreRowModel()
  });
  return <TableDefault table={table} />;
};

export default WorkshopList;
