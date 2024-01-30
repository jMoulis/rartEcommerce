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
  product: IProductService;
}
export default function ProductDetail({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState<IProductImage | null>(
    null
  );
  const defaultImage = useMemo(() => {
    const foundImage: IProductImage | undefined =
      product.images.find((image) => image.default) ?? product.images[0];
    return foundImage;
  }, [product.images]);
  useEffect(() => {
    if (!selectedImage && defaultImage) {
      setSelectedImage(defaultImage);
    }
  }, [selectedImage, defaultImage]);

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
