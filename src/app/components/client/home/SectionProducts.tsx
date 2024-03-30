/* eslint-disable n/handle-callback-err */
'use client';
import { Section } from '../commons/layout/Section';
import { Subtitle } from '../commons/typography/Subtitle';
import { useTranslations } from 'next-intl';
import { Card } from './Card';
// import { products } from './products';
import { IProductImage, IProductService } from '@/src/types/DBTypes';
import { useCallback, useEffect, useState } from 'react';
import { onFindAllRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { toast } from 'react-toastify';
import { Grid } from './Grid';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { ButtonLink } from '../checkout/processing/commons/ButtonLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/pro-light-svg-icons';

interface Props {
  initialProducts: IProductService[];
}

export default function SectionProducts({ initialProducts }: Props) {
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
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Subtitle
          style={{
            color: 'var(--primary-color)',
          }}>
          {t('Home.products')}
        </Subtitle>
        <Grid>
          {products.map((product, imageIndex) => (
            <Card
              textColor='var(--primary-color)'
              boxShadow='rgba(8, 91, 121, 0.1)'
              key={imageIndex}
              src={imageProduct(product)}
              title={product.name}
              price={product.price}
              description={product.description}
              id={product._id!}
              hrefRoot='products'>
              {/* <AddToCart item={product} /> */}
              <ButtonLink href={`${ENUM_ROUTES.PRODUCTS}/${product._id}`}>
                {t('commons.detailedInformation')}
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ marginLeft: '10px' }}
                />
              </ButtonLink>
            </Card>
          ))}
        </Grid>
      </Section>
    </>
  );
}
