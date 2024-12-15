import { IOccurence } from '@/src/types/DBTypes';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IconButton } from '../../../commons/Buttons/IconButton';
import { useToggle } from '../../../hooks/useToggle';
import { faEye } from '@fortawesome/pro-light-svg-icons';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useTranslations } from 'next-intl';
import { DialogContent } from '../../../commons/dialog/DialogContent';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import { SwitchGroup } from '../../../commons/form/SwitchGroup';
import { v4 } from 'uuid';
import { Button } from '../../../commons/Buttons/Button';
import { uploadFile } from '@/src/lib/firebase/firestorage';
import { toast } from 'react-toastify';

interface Props {
  occurrences: IOccurence[];
  sessionId: string;
  onSaveOccurrences: (jsonUrl: string) => void;
}

const columnHelper = createColumnHelper<IOccurence>();

const columns = [
  columnHelper.accessor((row) => row.dayString, {
    id: 'dayString',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>Jour</span>
  }),
  columnHelper.accessor((row) => row.dayNumber, {
    id: 'dayNumber',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>Numéro</span>
  }),
  columnHelper.accessor((row) => row.monthString, {
    id: 'monthString',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>Mois</span>
  }),
  columnHelper.accessor((row) => row.yearString, {
    id: 'yearString',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>Année</span>
  }),
  columnHelper.accessor((row) => row.time24, {
    id: 'time24',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>Heure</span>
  }),
  columnHelper.accessor((row, index) => row.available, {
    id: 'available',
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      const [value, setValue] = React.useState(initialValue);

      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.checked);
        table.options.meta?.updateData?.(
          index,
          id,
          event.currentTarget.checked
        );
      };
      return (
        <SwitchGroup
          name='available'
          value={value}
          id={`available-${v4()}`}
          onInputChange={handleSwitch}
        />
      );
    },
    header: () => <span></span>
  })
];

export const Occurrences = ({
  occurrences,
  sessionId,
  onSaveOccurrences
}: Props) => {
  const [editableOccurrences, setEditableOccurrences] = useState<IOccurence[]>(
    []
  );

  const { open, onOpen, onClose } = useToggle();
  const t = useTranslations();

  useEffect(() => {
    setEditableOccurrences(occurrences);
  }, [occurrences]);

  const table = useReactTable({
    data: editableOccurrences,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setEditableOccurrences((old) => {
          return old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value
              };
            }
            return row;
          });
        });
      }
    }
  });

  const handleSubmitUpdatedOccurrences = async () => {
    try {
      const url = await uploadFile(
        JSON.stringify(
          editableOccurrences.map((occurence) => ({ ...occurence, sessionId }))
        ),
        `occurrences/${sessionId}`
      );
      onSaveOccurrences(url);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div>
      <IconButton icon={faEye} onClick={onOpen} />
      <FullDialog
        onClose={onClose}
        open={open}
        header={{
          title: t('Session.generatedDates', {
            count: occurrences.length
          })
        }}>
        <DialogContent>
          <div className='p-2'>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {table.getFooterGroups().map((footerGroup) => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
          <Button onClick={handleSubmitUpdatedOccurrences}>
            {t('commons.add')}
          </Button>
        </DialogContent>
      </FullDialog>
    </div>
  );
};
