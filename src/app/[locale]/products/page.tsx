import { findByQuery } from '@/src/lib/firebase/firestore/crud';
import Products from '../../components/client/products';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICategory } from '@/src/types/DBTypes';

export default async function ProductPage() {
  const initialProducts: any = await findByQuery(ENUM_COLLECTIONS.PRODUCTS, {
    published: true,
  });
  const initialCategories: ICategory[] = (await findByQuery(
    ENUM_COLLECTIONS.CATEGORIES,
    {}
  )) as ICategory[];

  return (
    <Products
      initialProducts={initialProducts}
      initialCategories={initialCategories}
    />
  );
}
