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
import SectionHeader from '../../home/SectionHeader';
import { Flexbox } from '../../../commons/Flexbox';
import Breadcrumb from '../../products/Breadcrumb';
import { ProductSection } from '../../products/ProductSection';

const Placeholder = styled.div`
  height: 300px;
`;
const ImageContent = styled.div`
  position: relative;
  height: 300px;
  width: 300px;
  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 20px;
  }
`;
const Description = styled.p`
  text-align: justify;
  white-space: pre-wrap;
`;
const Title = styled.h2`
  color: var(--secondary-color);
  margin-bottom: 10px;
`;

interface Props {
  initialWorkshop: IWorkshop | null;
  preview: boolean;
}
export default function WorkshopDetail({ initialWorkshop, preview }: Props) {
  const [workshop, setWorkshop] = useState<IWorkshop | null>(null);

  const sections = useMemo(() => {
    return workshop?.sections.filter((section) => section.published) ?? [];
  }, [workshop?.sections]);

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
        paddingTop: 0
      }}>
      <SectionHeader
        backgroundImage={defaultImage?.url ?? ''}
        title={workshop.name}
        description=''
      />
      <Breadcrumb text={workshop.name} />
      <WrapperSection>
        <Section
          style={{
            justifyContent: 'unset'
          }}>
          {selectedImage ? (
            <ImageContent>
              <Image
                fill
                style={{
                  objectFit: 'cover',
                  borderRadius: '10px'
                }}
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                src={selectedImage.url}
                alt={selectedImage.name}
              />
            </ImageContent>
          ) : (
            <Placeholder />
          )}
          <Flexbox
            flexDirection='column'
            style={{
              margin: '0 10px',
              flex: 1
            }}>
            <Title>{workshop.name}</Title>
            <Description>{workshop.description}</Description>
            {sections.map((section, key) => (
              <ProductSection
                titleColor='var(--secondary-color)'
                key={key}
                section={section}
                preview={preview}
                onSelectOption={() => {}}
                selectedProductOptions={new Map()}
              />
            ))}
          </Flexbox>
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
