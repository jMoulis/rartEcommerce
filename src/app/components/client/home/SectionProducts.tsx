/* eslint-disable n/handle-callback-err */
'use client';
import { Section } from '../commons/layout/Section';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
// import { products } from './products';
import { IProductImage, IProductService } from '@/src/types/DBTypes';
import { useCallback, useEffect, useState } from 'react';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';

interface Props {
  initialProducts: IProductService[];
}

export default function SectionProducts({ initialProducts }: Props) {
  const [products, setProducts] = useState<IProductService[]>(initialProducts);
  const { onFindAllRealtime } = useFirestore();

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
        // console.log(error);
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
  const t = useTranslations();
  const imageProduct = useCallback((product: IProductService) => {
    const defaultImage: IProductImage | undefined =
      product.images.find((image) => image.default) ?? product.images[0];
    return defaultImage?.url;
  }, []);
  return (
    <>
      <Section
        style={{
          minHeight: '500px',
          flexWrap: 'wrap',
          flexDirection: 'column',
          justifyContent: 'unset',
        }}>
        <Subtitle
          style={{
            color: 'var(--default-font-color)',
          }}>
          {t('Home.products')}
        </Subtitle>
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
              hrefRoot='products'
              item={product}
            />
          ))}
        </Flexbox>
      </Section>
    </>
  );
}
