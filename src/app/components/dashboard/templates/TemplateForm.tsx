'use client';

import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { ITemplate } from '@/src/types/DBTypes';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Section } from '../products/CreateForm/sections/Section';
import { Flexbox } from '../../commons/Flexbox';
import {
  defaultSection,
  buildDefaultTemplate,
} from '../products/CreateForm/defaultData';
import { TemplateHeader } from './TemplateHeader';
import { Menu } from '../products/CreateForm/RightMenu/Menu';
import { arrayUnion, collection, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/src/lib/firebase/firebase';
import {
  onUpdateDocument,
  onCreateDocument,
  onDeleteDocument,
} from '@/src/app/contexts/firestore/useFirestore';

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
  prevTemplate?: ITemplate;
}

export const TemplateForm = ({ prevTemplate }: Props) => {
  const t = useTranslations();
  const defaultTemplate = buildDefaultTemplate(t);
  const [form, setForm] = useState<ITemplate>(defaultTemplate);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (prevTemplate) {
      setForm(prevTemplate);
    } else {
      setForm(defaultTemplate);
    }
  }, [prevTemplate]);
  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (prevTemplate?._id) {
        await onUpdateDocument(
          form,
          ENUM_COLLECTIONS.TEMPLATES,
          prevTemplate._id
        );
        const batch = writeBatch(db);

        form.categories.forEach((category) => {
          const categoryRef = doc(
            collection(db, ENUM_COLLECTIONS.CATEGORIES),
            category
          );
          batch.update(categoryRef, { templates: arrayUnion(form._id) });
        });

        await batch.commit();
      } else {
        const payload = await onCreateDocument(
          form,
          ENUM_COLLECTIONS.TEMPLATES
        );
        router.replace(`/dashboard/templates/${payload.data?._id}`);
      }
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
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
      sections: [...prev.sections, newSection],
    }));
  };
  const handleDelete = async (templateId?: string) => {
    if (!templateId) return;
    try {
      await onDeleteDocument(ENUM_COLLECTIONS.TEMPLATES, templateId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
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
          properties: [...section.properties],
        }));

        const currentSection = sectionsClone.find(
          (section) => section.id === sectionId
        );
        if (!currentSection) return prevForm;

        const propertyIndex = currentSection.properties.findIndex(
          (property) => property.id === propertyId
        );
        if (propertyIndex <= 0) return prevForm;
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
        const sectionsClone = prevForm.sections.map((section) => ({
          ...section,
          properties: [...section.properties],
        }));
        const currentSection = sectionsClone.find(
          (section) => section.id === sectionId
        );
        if (!currentSection) return prevForm;
        const propertyIndex = currentSection.properties.findIndex(
          (property) => property.id === propertyId
        );
        if (
          propertyIndex === -1 ||
          propertyIndex === currentSection.properties.length - 1
        ) {
          return prevForm;
        }
        [
          currentSection.properties[propertyIndex],
          currentSection.properties[propertyIndex + 1],
        ] = [
          currentSection.properties[propertyIndex + 1],
          currentSection.properties[propertyIndex],
        ];
        return { ...prevForm, sections: sectionsClone };
      });
    },
    [form.sections]
  );
  const handleSelectCategory = useCallback((categoryId: string) => {
    setForm((prev) => ({
      ...prev,
      categories: [...prev.categories, categoryId],
    }));
  }, []);
  const handleDeleteCategory = useCallback((categoryId: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.filter((prev) => prev !== categoryId),
    }));
  }, []);

  return (
    <div
      style={{
        overflow: 'auto',
      }}>
      {saving ? <LoadingBackdrop /> : null}
      <TemplateHeader
        onSaveTemplate={handleSubmit}
        onDeleteTemplate={handleDelete}
        onAddSection={handleAddSection}
        onTemplateNameChange={handleInputChange}
        onDeleteCategory={handleDeleteCategory}
        template={form}
      />
      <Flexbox>
        <Content>
          {form.sections.map((section, key) => (
            <Section
              section={section}
              sectionArrayIndex={key}
              sectionsLength={form.sections.length}
              key={key}
              onUpdateSection={setForm as any}
              onArchiveSection={() => {}}
              onMoveSectionDown={handleMoveSectionDown}
              onMoveSectionUp={handleMoveSectionUp}
              onMovePropertyDown={handleMovePropertyDown}
              onMovePropertyUp={handleMovePropertyUp}
              noPublished
            />
          ))}
        </Content>
        <Menu
          onSelectCategory={handleSelectCategory}
          previousSelectedCategories={form.categories}
        />
      </Flexbox>
    </div>
  );
};
