import { ProductDetail } from '@/src/app/components/dashboard/products/productDetail/ProductDetail';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';

export default async function ProductDetailPage({ params }: any) {
  const product: any = await getDocument(params.id, ENUM_COLLECTIONS.PRODUCTS);
  return <ProductDetail product={product} />;
}
