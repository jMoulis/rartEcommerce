import { useCallback, useState } from 'react';
import { onFetchDocsByIdsArray } from '../../contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IProductService } from '@/src/types/DBTypes';

export const useOptions = () => {
  const [options, setOptions] = useState<IProductService[]>([]);
  const fetchProducts = useCallback(async (ids: string[]) => {
    try {
      const { data: products } = await onFetchDocsByIdsArray(
        ids,
        ENUM_COLLECTIONS.PRODUCTS
      );
      setOptions(products);
    } catch (error) {}
  }, []);
  return {
    options,
    onFetchOptions: fetchProducts,
  };
};
