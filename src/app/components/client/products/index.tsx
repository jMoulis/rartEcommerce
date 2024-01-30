'use client';
import { Page } from '@/src/app/components/client/commons/layout/Page';
import { IProductService } from '@/src/types/DBTypes';
interface Props {
  products: IProductService[];
}
export default function Products({ products }: Props) {
  return <Page>Products</Page>;
}
