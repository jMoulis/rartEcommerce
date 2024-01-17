'use client';

import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { SubmitButton } from './SubmitButton';
import { IProductService, ISection } from '@/src/types/DBTypes';
import { ImageLoader } from './ImageLoader/ImageLoader';
import {
  onCreateDocument,
  onUpdateDocument,
} from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IImageType } from './ImageLoader/types';
import { Section } from './sections/Section';
import './style.css';
import { useTranslations } from 'next-intl';
import { defaultProduct, defaultSection } from './defaultData';
import { SwipeableDrawer } from '@mui/material';
import { useToggle } from '../../../hooks/useToggle';
import { Flexbox } from '../../../commons/Flexbox';

const Header = styled.header`
  padding: 10px;
  display: flex;
  justify-content: space-between;
`;
const LoadingBackdrop = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 255, 0.01);
  z-index: 10;
`;

interface Props {
  prevProduct?: IProductService;
}
export const CreateForm = ({ prevProduct }: Props) => {
  const defaultData = defaultProduct();
  const [form, setForm] = useState<IProductService>(defaultData);
  const [saving, setSaving] = useState(false);
  const t = useTranslations('ProductForm');
  const tCommons = useTranslations('commons');
  const {
    open: openArchive,
    onOpen: onOpenArchive,
    onClose: onCloseArchive,
  } = useToggle();

  useEffect(() => {
    if (prevProduct) {
      setForm(prevProduct);
    } else {
      setForm(defaultData);
    }
  }, [prevProduct]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (prevProduct?.id) {
        await onUpdateDocument(form, ENUM_COLLECTIONS.PRODUCTS, prevProduct.id);
      } else {
        await onCreateDocument(form, ENUM_COLLECTIONS.PRODUCTS);
      }
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  const handleSubmitImages = (images: IImageType[]) => {
    setForm((prev) => ({
      ...prev,
      images,
    }));
  };

  const handleUpdateSection = (section: ISection) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((prevSection) =>
        prevSection.id === section.id ? section : prevSection
      ),
    }));
  };

  const handleArchiveSection = (sectionId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: prev.sections.map((prevSection) =>
        prevSection.id === sectionId
          ? { ...prevSection, archive: true }
          : prevSection
      ),
    }));
  };
  const handleAddSection = () => {
    const newSection = defaultSection();
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  };

  const activeSections = useMemo(() => {
    return form.sections.filter((section) => !section.archive);
  }, [form.sections]);
  const archives = useMemo(() => {
    return form.sections.filter((section) => section.archive);
  }, [form.sections]);

  return (
    <>
      {saving ? <LoadingBackdrop /> : null}
      <Header>
        <SubmitButton
          disabled={saving}
          saving={saving}
          onClick={handleSubmit}
        />
        <Flexbox>
          <button type='button' className='button' onClick={handleAddSection}>
            {t('addSection')}
          </button>
          <button
            type='button'
            className='button button-cancel'
            onClick={onOpenArchive}>
            {tCommons('archives')}
          </button>
        </Flexbox>
      </Header>
      <ImageLoader
        images={form.images ?? []}
        onSubmitImages={handleSubmitImages}
      />
      {activeSections.map((section, key) => (
        <Section
          section={section}
          key={key}
          onUpdateSection={handleUpdateSection}
          onArchiveSection={handleArchiveSection}
        />
      ))}
      {/* <Details form={form} onInputChange={handleInputChange} />
      <Price form={form} onInputChange={handleInputChange} /> */}
      {/*
      <Properties
        form={form}
        onUpdateProperty={handleUpdateProperty}
        onAddProperty={handleAddProperty}
      /> */}
      <SwipeableDrawer
        open={openArchive}
        onClose={onCloseArchive}
        anchor='right'
        onOpen={onOpenArchive}>
        <ul>
          {archives.map((archive, key) => (
            <li key={key}>{archive.title}</li>
          ))}
        </ul>
      </SwipeableDrawer>
    </>
  );
};
