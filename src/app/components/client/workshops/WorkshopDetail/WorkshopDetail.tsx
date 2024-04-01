/* eslint-disable n/handle-callback-err */
'use client';
import { Page } from '@/src/app/components/client/commons/layout/Page';
import { IProductImage, IWorkshop } from '@/src/types/DBTypes';
import { Section } from '../../commons/layout/Section';
import styled from '@emotion/styled';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { onFindSingleRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Unsubscribe } from 'firebase/firestore';
import { SessionList } from './SessionList';
import { toast } from 'react-toastify';
import WrapperSection from '../../commons/layout/WrapperSection';

const Title = styled.h1`
  z-index: 10;
  font-size: 60px;
  color: #fff;
`;

const Placeholder = styled.div`
  height: 300px;
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
  initialWorkshop: IWorkshop | null;
  preview: boolean;
}
export default function WorkshopDetail({ initialWorkshop, preview }: Props) {
  const [workshop, setWorkshop] = useState<IWorkshop | null>(null);

  useEffect(() => {
    setWorkshop(initialWorkshop);
  }, [initialWorkshop]);

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (workshop?._id) {
      unsubscribe = onFindSingleRealtime(
        ENUM_COLLECTIONS.WORKSHOPS,
        workshop?._id,
        (data) => {
          setWorkshop(data);
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
  }, [workshop?._id]);
  const [selectedImage, setSelectedImage] = useState<IProductImage | null>(
    null
  );
  const defaultImage = useMemo(() => {
    const foundImage: IProductImage | undefined = workshop?.image;
    return foundImage;
  }, [workshop?.image]);

  useEffect(() => {
    if (!selectedImage && defaultImage) {
      setSelectedImage(defaultImage);
    }
  }, [selectedImage, defaultImage]);

  if (!workshop) return null;

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
        <Title>{workshop.name}</Title>
        <BackgroundImageWrapper>
          <Image
            alt={workshop.name}
            src={defaultImage?.url ?? ''}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{
              objectFit: 'cover',
            }}
          />
        </BackgroundImageWrapper>
      </Section>
      <WrapperSection>
        <Section
          style={{
            justifyContent: 'unset',
          }}>
          {selectedImage ? (
            <Image
              height={300}
              width={300}
              style={{
                objectFit: 'cover',
                borderRadius: '10px',
              }}
              src={selectedImage.url}
              alt={selectedImage.name}
            />
          ) : (
            <Placeholder />
          )}
          <SessionList
            preview={preview}
            sessions={workshop.sessions}
            workshop={workshop}
          />
        </Section>
      </WrapperSection>
    </Page>
  );
}
