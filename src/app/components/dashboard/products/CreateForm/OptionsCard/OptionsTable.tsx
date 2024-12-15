import { Button } from '@/src/app/components/commons/Buttons/Button';
import TableDefault from '@/src/app/components/commons/Layouts/TableDefault';
import {
  findAllOnce,
  onFetchDocsByIdsArray
} from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IProductService } from '@/src/types/DBTypes';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

const columnHelper = createColumnHelper<IProductService>();

const columns = [
  columnHelper.accessor((row) => row._id, {
    id: 'id',
    header: () => <span />,
    cell: (info) => <span />
  }),
  columnHelper.accessor((row) => row.images, {
    id: 'image',
    header: () => <span />,
    cell: ({ row }) => {
      const [image] = row.original.images || [];
      if (!image) return null;
      return <Image alt='image' src={image?.url} width={50} height={50} />;
    }
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'name',
    header: () => <span>Header</span>,
    cell: (info) => {
      return info.getValue();
    }
  }),
  columnHelper.accessor((row) => row.name, {
    id: 'action',
    header: () => <span>Action</span>,
    cell: ({ row, table }) => {
      const onSelectProduct = table.options.meta?.onSelectProduct;
      return (
        <Button onClick={() => onSelectProduct?.(row.original)}>Button</Button>
      );
    }
  })
];

interface Props {
  onSelect: (product: IProductService) => void;
}

function OptionsTable({ onSelect }: Props) {
  const [products, setProducts] = useState<IProductService[]>([]);
  const [loading, setLoading] = useState<'UNSET' | 'LOADING' | 'DONE'>('UNSET');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading('LOADING');
      const payload = await findAllOnce(ENUM_COLLECTIONS.PRODUCTS);
      if (Array.isArray(payload.data)) {
        const fullData = await Promise.all(
          payload.data.map(async (prevProduct: IProductService) => {
            const { data: categories } = await onFetchDocsByIdsArray(
              prevProduct.categories,
              ENUM_COLLECTIONS.CATEGORIES
            );
            return {
              ...prevProduct,
              categories: categories ?? []
            };
          })
        );
        setProducts(fullData);
      }
      setLoading('DONE');
    } catch (error) {
      setLoading('DONE');
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const table = useReactTable({
    columns,
    data: products,
    meta: {
      onSelectProduct: onSelect
    },
    state: {
      columnVisibility: {
        id: false
      }
    },
    getCoreRowModel: getCoreRowModel()
  });
  if (loading !== 'DONE') return;

  return (
    <div>
      <TableDefault table={table} />
    </div>
  );
}
export default OptionsTable;
