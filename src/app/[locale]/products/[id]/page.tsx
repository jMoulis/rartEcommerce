import ProductDetail from '@/src/app/components/client/products/ProductDetail';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage({ params }: any) {
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.PRODUCTS);
  if (payload.error) notFound();
  return <ProductDetail initialProduct={payload.data} preview={false} />;
}
