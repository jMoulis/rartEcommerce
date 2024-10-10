import { onFetchDocsByIdsArray } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IInvoice } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { useTableInvoices } from '../financial/invoices/useTableInvoices';
import TableDefault from '../../commons/Layouts/TableDefault';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';

interface Props {
  invoiceIds: string[];
}

function InvoicesSummary({ invoiceIds }: Props) {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const { columns } = useTableInvoices(true);
  useEffect(() => {
    if (invoiceIds.length) {
      onFetchDocsByIdsArray(invoiceIds, ENUM_COLLECTIONS.INVOICES).then(
        (response) => {
          setInvoices(response.data || []);
        }
      );
    }
  }, [invoiceIds]);
  const table = useReactTable({
    columns,
    data: invoices,
    state: {
      columnVisibility: {
        id: false,
      },
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <TableDefault table={table} />
    </div>
  );
}

export default InvoicesSummary;
