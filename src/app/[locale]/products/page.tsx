import { findByQuery } from '@/src/lib/firebase/firestore/crud';
import Products from '../../components/client/products';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

export default async function ProductPage() {
  const products: any = await findByQuery(ENUM_COLLECTIONS.PRODUCTS, {
    published: true,
  });
  return <Products products={products} />;
}
