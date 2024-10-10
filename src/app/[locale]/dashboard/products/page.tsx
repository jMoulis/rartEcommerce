import { Products } from '@/src/app/components/dashboard/products/Products';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function ProductPage() {
  const products: any = await findAll(ENUM_COLLECTIONS.PRODUCTS);
  return <Products initialProducts={products ?? []} />;
}
