'use client';
import { Section } from '../commons/layout/Section';
import { Flexbox } from '../../commons/Flexbox';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
// import { products } from './products';
import { IProductImage, IProductService } from '@/src/types/DBTypes';
import { useCallback } from 'react';

interface Props {
  products: IProductService[];
}

export default function SectionProducts({ products }: Props) {
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
            />
          ))}
        </Flexbox>
      </Section>
    </>
  );
}
