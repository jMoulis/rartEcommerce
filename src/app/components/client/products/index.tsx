'use client';

import { Page } from '@/src/app/components/client/commons/layout/Page';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IProductImage, IProductService } from '@/src/types/DBTypes';
import { useCallback, useEffect, useState } from 'react';
import { Flexbox } from '../../commons/Flexbox';
import { Card } from '../home/Card';
import { Section } from '../commons/layout/Section';
import { SectionHeader } from '../../commons/Layouts/SectionHeader';
import { AddToCart } from '../checkout/processing/cart/AddToCart';
import { toast } from 'react-toastify';

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

  const imageProduct = useCallback((product: IProductService) => {
    const defaultImage: IProductImage | undefined =
      product.images.find((image) => image.default) ?? product.images[0];
    return defaultImage?.url;
  }, []);

  return (
    <Page>
      <SectionHeader />
      <Section>
        <Flexbox flexWrap='wrap'>
          {products.map((product, imageIndex) => (
            <Card
              textColor='var(--default-font-color)'
              key={imageIndex}
              src={imageProduct(product)}
              title={product.name}
              price={product.price}
              description={product.description}
              id={product._id!}
              hrefRoot='products'>
              {' '}
              <AddToCart item={product} />
            </Card>
          ))}
        </Flexbox>
      </Section>
    </Page>
  );
}
