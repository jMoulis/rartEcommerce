'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IProductService } from '@/src/types/DBTypes';
import { useEffect, useState } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Section } from '../commons/layout/Section';
import { SectionHeader } from '../../commons/Layouts/SectionHeader';
import { toast } from 'react-toastify';
import { ProductListItem } from './ProductListItem';

interface Props {
  initialProducts: IProductService[];
}

export default function Products({ initialProducts }: Props) {
  const [products, setProducts] = useState<IProductService[]>(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const unsubscribe = onFindAllRealtime(
      ENUM_COLLECTIONS.PRODUCTS,
      (data) => {
        setProducts(data);
      },
      (error) => {
        toast.error(error.message);
      },
      {
        published: true,
      }
    );

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <Page>
      <SectionHeader />
      <Section>
        <Flexbox flexWrap='wrap'>
          {products.map((product, key) => (
            <ProductListItem key={key} product={product} />
          ))}
        </Flexbox>
      </Section>
    </Page>
  );
}
