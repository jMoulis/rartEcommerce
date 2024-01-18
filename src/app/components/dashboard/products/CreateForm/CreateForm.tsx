'use client';

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { IProductService, ISection } from '@/src/types/DBTypes';
import { ImageLoader } from './ImageLoader/ImageLoader';
import {
  onCreateDocument,
  onUpdateDocument,
  onDeleteDocument,
} from '@/src/lib/firebase/firestore/crud';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IImageType } from './ImageLoader/types';
import { Section } from './sections/Section';
import './style.css';
import { defaultProduct, defaultSection } from './defaultData';
import { CreateFormHeader } from './CreateFormHeader';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ProductDetailForm } from './ProductDetailForm';
import { sortArrayByKey } from './utils';
import { PriceCard } from './PriceCard';
import { Flexbox } from '../../../commons/Flexbox';
import { Menu } from './RightMenu/Menu';

const LoadingBackdrop = styled.div`
  position: absolute;
  top: 60px;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 255, 0.2);
  z-index: 10;
`;

const Content = styled.div`
  overflow: auto;
  position: relative;
  flex: 1;
`;

interface Props {
  prevProduct?: IProductService;
}

export const CreateForm = ({ prevProduct }: Props) => {
  const defaultData = defaultProduct();
  const [form, setForm] = useState<IProductService>(defaultData);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const t = useTranslations();

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
        const payload = await onCreateDocument(form, ENUM_COLLECTIONS.PRODUCTS);
        router.replace(`/dashboard/products/${payload.data?.id}`);
      }
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };
  const handleDeleteProduct = async (productId?: string) => {
    if (!productId) return;
    try {
      setSaving(true);
      await onDeleteDocument(ENUM_COLLECTIONS.PRODUCTS, productId);
      setSaving(false);
      router.replace('/dashboard/products');
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
  const handleArchiveSection = (sectionId: string) => {
    setForm((prev) => {
      const updatedSections = sortArrayByKey(
        prev.sections.map((prevSection) =>
          prevSection.id === sectionId
            ? { ...prevSection, isArchived: !prevSection.isArchived }
            : prevSection
        ),
        'isArchived'
      ) as ISection[];
      return {
        ...prev,
        sections: updatedSections,
      };
    });
  };
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleAddSection = () => {
    const newSection = defaultSection(t);
    setForm((prev) => ({
      ...prev,
      sections: sortArrayByKey(
        [...prev.sections, newSection],
        'archived'
      ) as ISection[],
    }));
  };
  const handleMoveSectionUp = useCallback(
    (sectionId: string) => {
      const updatedSections = [...(form.sections || [])];

      const index = updatedSections.findIndex((prev) => prev.id === sectionId);
      if (index > 0) {
        [updatedSections[index], updatedSections[index - 1]] = [
          updatedSections[index - 1],
          updatedSections[index],
        ];
      }
      setForm((prev) => ({
        ...prev,
        sections: updatedSections,
      }));
    },
    [form.sections]
  );
  const handleMoveSectionDown = useCallback(
    (sectionId: string) => {
      const updatedSections = [...(form.sections || [])];
      const index = updatedSections.findIndex((prev) => prev.id === sectionId);
      if (index < updatedSections.length - 1) {
        [updatedSections[index], updatedSections[index + 1]] = [
          updatedSections[index + 1],
          updatedSections[index],
        ];
      }
      setForm((prev) => ({
        ...prev,
        sections: updatedSections,
      }));
    },
    [form.sections]
  );
  const handleMovePropertyUp = useCallback(
    (propertyId: string, sectionId: string) => {
      setForm((prevForm) => {
        const sectionsClone = prevForm.sections.map((section) => ({
          ...section,
          properties: [...section.properties], // Deep clone properties
        }));

        const currentSection = sectionsClone.find(
          (section) => section.id === sectionId
        );
        if (!currentSection) return prevForm;

        const propertyIndex = currentSection.properties.findIndex(
          (property) => property.id === propertyId
        );
        if (propertyIndex <= 0) return prevForm; // Check if it's not the first element

        // Swap elements
        [
          currentSection.properties[propertyIndex],
          currentSection.properties[propertyIndex - 1],
        ] = [
          currentSection.properties[propertyIndex - 1],
          currentSection.properties[propertyIndex],
        ];

        return { ...prevForm, sections: sectionsClone };
      });
    },
    [form.sections]
  );
  const handleMovePropertyDown = useCallback(
    (propertyId: string, sectionId: string) => {
      setForm((prevForm) => {
        // Deep cloning the sections array and the properties within each section
        const sectionsClone = prevForm.sections.map((section) => ({
          ...section,
          properties: [...section.properties],
        }));

        // Finding the section that contains the property to be moved
        const currentSection = sectionsClone.find(
          (section) => section.id === sectionId
        );
        if (!currentSection) return prevForm;

        // Finding the index of the property to be moved
        const propertyIndex = currentSection.properties.findIndex(
          (property) => property.id === propertyId
        );

        // If the property is not found or it's already the last element, return the previous state
        if (
          propertyIndex === -1 ||
          propertyIndex === currentSection.properties.length - 1
        ) {
          return prevForm;
        }

        // Swapping the property with the one below it
        [
          currentSection.properties[propertyIndex],
          currentSection.properties[propertyIndex + 1],
        ] = [
          currentSection.properties[propertyIndex + 1],
          currentSection.properties[propertyIndex],
        ];

        // Returning the new state with the updated sections
        return { ...prevForm, sections: sectionsClone };
      });
    },
    [form.sections]
  );
  const handleArchiveProduct = useCallback(
    async (productId?: string) => {
      if (!productId) return;
      const updatedForm: IProductService = {
        ...form,
        isArchived: !form.isArchived,
      };
      setForm(updatedForm);
      try {
        await onUpdateDocument(
          updatedForm,
          ENUM_COLLECTIONS.PRODUCTS,
          productId
        );
      } catch (error) {
        // console.error(error);
      }
    },
    [form]
  );
  const handlePublishProduct = useCallback(
    async (event: ChangeEvent<HTMLInputElement>, productId?: string) => {
      const { checked } = event.currentTarget;
      if (!productId) return;

      const updatedForm: IProductService = {
        ...form,
        published: checked,
      };
      setForm(updatedForm);
    },
    [form]
  );
  const handleStockStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };
  return (
    <>
      {saving || form.isArchived ? <LoadingBackdrop /> : null}
      <CreateFormHeader
        saving={saving}
        onAddSection={handleAddSection}
        onSubmit={handleSubmit}
        product={form}
        onDeleteProduct={handleDeleteProduct}
        onArchiveProduct={handleArchiveProduct}
        onPublishProduct={handlePublishProduct}
      />
      <Flexbox
        style={{
          overflow: 'hidden',
        }}>
        <Content>
          <ImageLoader
            images={form.images ?? []}
            onSubmitImages={handleSubmitImages}
          />
          <ProductDetailForm form={form} onInputChange={handleInputChange} />
          <PriceCard
            form={form}
            onInputChange={handleInputChange}
            onStockStatusChange={handleStockStatusChange}
          />
          {form.sections.map((section, key) => (
            <Section
              section={section}
              sectionArrayIndex={key}
              sectionsLength={form.sections.length}
              key={key}
              onUpdateSection={setForm}
              onArchiveSection={handleArchiveSection}
              onMoveSectionDown={handleMoveSectionDown}
              onMoveSectionUp={handleMoveSectionUp}
              onMovePropertyDown={handleMovePropertyDown}
              onMovePropertyUp={handleMovePropertyUp}
            />
          ))}
        </Content>
        <Menu />
      </Flexbox>
    </>
  );
};
