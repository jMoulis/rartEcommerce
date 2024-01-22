import { IOccurence, ISession } from '@/src/types/DBTypes';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IconButton } from '../../../commons/Buttons/IconButton';
import { useToggle } from '../../../hooks/useToggle';
import { faEye } from '@fortawesome/pro-light-svg-icons';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useTranslations } from 'next-intl';
import { DialogContent } from '../../../commons/dialog/DialogContent';
import {
  RowData,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { SwitchGroup } from '../../../commons/form/SwitchGroup';
import { v4 } from 'uuid';
import { Button } from '../../../commons/Buttons/Button';

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

function useSkipper() {
  const shouldSkipRef = React.useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = React.useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  React.useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}
interface Props {
  occurences: IOccurence[];
}

const columnHelper = createColumnHelper<IOccurence>();

const columns = [
  columnHelper.accessor((row) => row.dayString, {
    id: 'dayString',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>dayString</span>,
  }),
  columnHelper.accessor((row) => row.dayNumber, {
    id: 'dayNumber',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>dayNumber</span>,
  }),
  columnHelper.accessor((row) => row.monthString, {
    id: 'monthString',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>monthString</span>,
  }),
  columnHelper.accessor((row) => row.yearString, {
    id: 'yearString',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>yearString</span>,
  }),
  columnHelper.accessor((row) => row.time24, {
    id: 'time24',
    cell: (info) => <span>{info.getValue()}</span>,
    header: () => <span>time24</span>,
  }),
  columnHelper.accessor((row, index) => row.available, {
    id: 'available',
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = React.useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const handleSwitch = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.currentTarget.checked);
        table.options.meta?.updateData(index, id, event.currentTarget.checked);
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
    header: () => <span>available</span>,
  }),
];

export const Occurences = ({ occurences }: Props) => {
  const [editableOccurences, setEditableOccurences] = useState<IOccurence[]>(
    []
  );
  const { open, onOpen, onClose } = useToggle();
  const t = useTranslations();
  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  useEffect(() => {
    setEditableOccurences(occurences);
  }, []);
  const table = useReactTable({
    data: editableOccurences,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setEditableOccurences((old) => {
          return old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          });
        });
      },
    },
  });
  const handleSubmitUpdatedOccurences = () => {
    // UpdateFile
    console.log('Push file');
  };
  return (
    <div>
      <IconButton icon={faEye} onClick={onOpen} />
      <FullDialog
        onClose={onClose}
        open={open}
        header={{
          title: t('Session.generatedDates', {
            count: occurences.length,
          }),
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
          <Button onClick={handleSubmitUpdatedOccurences}>
            {t('commons.add')}
          </Button>
        </DialogContent>
      </FullDialog>
    </div>
  );
};
