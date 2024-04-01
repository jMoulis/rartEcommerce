/* eslint-disable n/handle-callback-err */
'use client';
import { Page } from '@/src/app/components/client/commons/layout/Page';
import { IProductImage, IProductService } from '@/src/types/DBTypes';
import { Section } from '../commons/layout/Section';
import { useEffect, useMemo, useState } from 'react';
import { ImageNavigation } from './ImageNavigation';
import { MainImage } from './MainImage';
import { ProductOptions } from './ProductOptions';
import { onFindSingleRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Unsubscribe } from 'firebase/firestore';
import { toast } from 'react-toastify';
import Breadcrumb from './Breadcrumb';
import WrapperSection from '../commons/layout/WrapperSection';
import SectionHeader from '../home/SectionHeader';

interface Props {
  initialProduct: IProductService | null;
  preview: boolean;
}
export default function ProductDetail({ initialProduct, preview }: Props) {
  const [product, setProduct] = useState<IProductService | null>(null);

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    if (preview) return;
    let unsubscribe: Unsubscribe | null = null;
    if (product?._id) {
      unsubscribe = onFindSingleRealtime(
        ENUM_COLLECTIONS.PRODUCTS,
        product?._id,
        (data) => {
          setProduct(data);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [product?._id]);

  const [selectedImage, setSelectedImage] = useState<IProductImage | null>(
    null
  );

  const defaultImage = useMemo(() => {
    const foundImage: IProductImage | undefined =
      product?.images.find((image) => image.default) ?? product?.images[0];
    return foundImage;
  }, [product?.images]);

  useEffect(() => {
    if (!selectedImage && defaultImage) {
      setSelectedImage(defaultImage);
    }
  }, [selectedImage, defaultImage]);

  if (!product) return null;

  return (
    <Page
      style={{
        paddingTop: 0,
      }}>
      <SectionHeader
        backgroundImage={defaultImage?.url ?? ''}
        title={product.name}
        description=''
      />

      <WrapperSection>
        {!preview ? (
          <Section
            style={{
              justifyContent: 'unset',
              padding: 0,
            }}>
            <Breadcrumb text={product.name} capitalizeLinks />
          </Section>
        ) : null}
        <Section
          style={{
            justifyContent: 'unset',
          }}>
          <ImageNavigation
            images={product.images}
            onSelectImage={setSelectedImage}
            selectedImage={selectedImage}
          />
          <MainImage image={selectedImage} />
          <ProductOptions product={product} preview={preview} />
        </Section>
      </WrapperSection>
    </Page>
  );
}
