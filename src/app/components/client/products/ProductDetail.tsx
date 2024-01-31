/* eslint-disable n/handle-callback-err */
'use client';
import { Page } from '@/src/app/components/client/commons/layout/Page';
import { IProductImage, IProductService } from '@/src/types/DBTypes';
import { Section } from '../commons/layout/Section';
import styled from '@emotion/styled';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { ImageNavigation } from './ImageNavigation';
import { MainImage } from './MainImage';
import { ProductOptions } from './ProductOptions';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Unsubscribe } from 'firebase/firestore';

const Title = styled.h1`
  z-index: 10;
  font-size: 60px;
  color: #fff;
`;

const BackgroundImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  filter: contrast(0.5);
`;

interface Props {
  initialProduct: IProductService;
}
export default function ProductDetail({ initialProduct }: Props) {
  const [product, setProduct] = useState<IProductService>();
  const { onFindSingleRealtime } = useFirestore();

  useEffect(() => {
    setProduct(initialProduct);
  }, [initialProduct]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (product?._id) {
      unsubscribe = onFindSingleRealtime(
        ENUM_COLLECTIONS.PRODUCTS,
        product?._id,
        (data) => {
          setProduct(data);
        },
        (error) => {
          // console.log(error);
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
      <Section
        style={{
          height: '300px',
          alignItems: 'flex-end',
          justifyContent: 'unset',
        }}>
        <Title>{product.name}</Title>
        <BackgroundImageWrapper>
          <Image
            alt={product.name}
            src={defaultImage?.url ?? ''}
            fill
            style={{
              objectFit: 'cover',
            }}
          />
        </BackgroundImageWrapper>
      </Section>
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
        <ProductOptions product={product} />
      </Section>
    </Page>
  );
}
