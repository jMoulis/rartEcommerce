'use client';

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { IProductService, ISection } from '@/src/types/DBTypes';
import { ImageLoader } from './ImageLoader/ImageLoader';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { IImageType } from './ImageLoader/types';
import { Section } from './sections/Section';
import { defaultProduct, defaultSection } from './defaultData';
import { CreateFormHeader } from './CreateFormHeader';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ProductDetailForm } from './ProductDetailForm';
import { sortArrayByKey } from './utils';
import { PriceCard } from './PriceCard';
import { Flexbox } from '../../../commons/Flexbox';
import { Menu } from './RightMenu/Menu';
import { OptionsCard } from './OptionsCard/OptionsCard';
import {
  onUpdateDocument,
  onCreateDocument,
  onDeleteDocument,
  findDocumentById
} from '@/src/app/contexts/firestore/useFirestore';
import Preview from './Preview';
import ProductDetail from '../../../client/products/ProductDetail';
import DeleveryCard from './DeliveryCard';

const LoadingBackdrop = styled.div`
  position: absolute;
  top: 60px;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 255, 0.2);
  z-index: 10;
`;
const AsideWrapper = styled(Flexbox)`
  margin-right: 10px;
  @media (max-width: 768px) {
    margin-right: 0;
    flex: 1;
  }
`;

const Content = styled.div`
  label: Content;
  overflow: auto;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

interface Props {
  prevProduct?: IProductService | null;
  onSubmit?: (product: IProductService) => void;
}

export const CreateForm = ({ prevProduct, onSubmit }: Props) => {
  const defaultData = defaultProduct();
  const [form, setForm] = useState<IProductService>(prevProduct ?? defaultData);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const [displayPreview, setPreview] = useState<boolean>(false);

  useEffect(() => {
    if (prevProduct?._id) {
      findDocumentById(prevProduct._id, ENUM_COLLECTIONS.PRODUCTS).then(
        (payload) => {
          setForm(payload.data as IProductService);
        }
      );
    } else {
      setForm(defaultData);
    }
  }, [prevProduct?._id]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (prevProduct?._id) {
        await onUpdateDocument(
          form,
          ENUM_COLLECTIONS.PRODUCTS,
          prevProduct._id
        );
      } else {
        const payload = await onCreateDocument(form, ENUM_COLLECTIONS.PRODUCTS);
        if (onSubmit) {
          onSubmit(payload.data);
        } else {
          router.replace(`/dashboard/products/${payload.data?._id}`);
        }
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
      images
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
        sections: updatedSections
      };
    });
  };
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name, type } = event.currentTarget;
    const formattedValue = type === 'number' ? parseFloat(value) : value;
    setForm((prev) => ({
      ...prev,
      [name]: formattedValue
    }));
  };
  const handleAddSection = () => {
    const newSection = defaultSection(t);
    setForm((prev) => ({
      ...prev,
      sections: sortArrayByKey(
        [...prev.sections, newSection],
        'archived'
      ) as ISection[]
    }));
  };
  const handleMoveSectionUp = useCallback(
    (sectionId: string) => {
      const updatedSections = [...(form.sections || [])];

      const index = updatedSections.findIndex((prev) => prev.id === sectionId);
      if (index > 0) {
        [updatedSections[index], updatedSections[index - 1]] = [
          updatedSections[index - 1],
          updatedSections[index]
        ];
      }
      setForm((prev) => ({
        ...prev,
        sections: updatedSections
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
          updatedSections[index]
        ];
      }
      setForm((prev) => ({
        ...prev,
        sections: updatedSections
      }));
    },
    [form.sections]
  );
  const handleMovePropertyUp = useCallback(
    (propertyId: string, sectionId: string) => {
      setForm((prevForm) => {
        const sectionsClone = prevForm.sections.map((section) => ({
          ...section,
          properties: [...section.properties] // Deep clone properties
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
          currentSection.properties[propertyIndex - 1]
        ] = [
          currentSection.properties[propertyIndex - 1],
          currentSection.properties[propertyIndex]
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
          properties: [...section.properties]
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
          currentSection.properties[propertyIndex + 1]
        ] = [
          currentSection.properties[propertyIndex + 1],
          currentSection.properties[propertyIndex]
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
        isArchived: !form.isArchived
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
        published: checked
      };

      setForm(updatedForm);
    },
    [form]
  );
  const handleStockStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: checked
    }));
  };
  const handleSelectCategory = (categoryId: string) => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections],
      categories: [...(prev.categories || []), categoryId]
    }));
  };
  const handleRemoveCategory = (categoryId: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories?.filter((id) => id !== categoryId)
    }));
  };
  const handleSelectSections = (sections: ISection[]) => {
    setForm((prev) => ({
      ...prev,
      sections: [...prev.sections, ...sections]
    }));
  };
  const handlePreview = () => {
    setPreview(true);
  };
  const handleDeliveryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      delivery: {
        ...prev.delivery,
        [name]: value
      }
    }));
  };
  return (
    <div
      style={{
        overflow: 'auto'
      }}>
      {saving || form.isArchived ? <LoadingBackdrop /> : null}
      <CreateFormHeader
        saving={saving}
        onAddSection={handleAddSection}
        onSubmit={handleSubmit}
        form={form}
        backgroundImage={form.images[0]}
        headerTitle={`${t('commons.delete')} - ${form.name}`}
        onDelete={handleDeleteProduct}
        onArchive={handleArchiveProduct}
        onPublish={handlePublishProduct}
        onNameChange={handleInputChange}
        onPreview={handlePreview}
        onDeleteCategory={handleRemoveCategory}
      />
      <Flexbox
        style={{
          flexWrap: 'wrap'
        }}>
        <Content
          style={{
            flexWrap: 'wrap'
          }}>
          <Flexbox flexWrap='wrap'>
            <ProductDetailForm form={form} onInputChange={handleInputChange} />
            <PriceCard
              form={form}
              onInputChange={handleInputChange}
              onStockStatusChange={handleStockStatusChange}
            />
          </Flexbox>
          <Flexbox
            style={{
              marginRight: '10px'
            }}>
            <ImageLoader
              images={form.images ?? []}
              onSubmitImages={handleSubmitImages}
            />
          </Flexbox>

          {form.sections.map((section, key) => (
            <Section
              section={section}
              sectionArrayIndex={key}
              sectionsLength={form.sections.length}
              key={key}
              onUpdateSection={setForm as any}
              onArchiveSection={handleArchiveSection}
              onMoveSectionDown={handleMoveSectionDown}
              onMoveSectionUp={handleMoveSectionUp}
              onMovePropertyDown={handleMovePropertyDown}
              onMovePropertyUp={handleMovePropertyUp}
            />
          ))}
        </Content>
        <AsideWrapper flexDirection='column'>
          <DeleveryCard form={form} onChange={handleDeliveryChange} />
          <Menu
            onSelectCategory={handleSelectCategory}
            onSelectSections={handleSelectSections}
            previousSelectedCategories={form.categories}
          />
          <OptionsCard form={form} onUpdateSection={setForm} />
        </AsideWrapper>
      </Flexbox>
      <Preview
        preview={form}
        open={displayPreview}
        onClose={() => setPreview(false)}>
        <ProductDetail initialProduct={form} preview />
      </Preview>
    </div>
  );
};
