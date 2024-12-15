import { IProductService } from './src/types/DBTypes';

declare module '@tanstack/table-core' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface TableMeta<TData extends RowData> {
    onSelectProduct?: (product: IProductService) => void;
    updateData?: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}
export { };
