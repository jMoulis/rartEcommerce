import { ProductDetail } from '@/src/app/components/dashboard/products/productDetail/ProductDetail';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function ProductDetailPage(props: any) {
  const params = await props.params;
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.PRODUCTS);
  if (payload.error) notFound();
  return <ProductDetail product={payload.data} />;
}
