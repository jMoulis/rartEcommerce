'use client';

import { IAddress, ICustomer, ISection } from '@/src/types/DBTypes';
import React, { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { CreateFormHeader } from '../products/CreateForm/CreateFormHeader';
import { useForm } from '../../hooks/useForm';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import {
  onUpdateDocument,
  onCreateDocument,
  onDeleteDocument
} from '@/src/app/contexts/firestore/useFirestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ENUM_ROUTES } from '../../navbar/routes.enums';
import { useRouter } from 'next/navigation';
import { Article } from '../products/CreateForm/Article';
import { InputGroup } from '../../commons/form/InputGroup';
import {
  defaultSection,
  generateDefaultCustomer
} from '../products/CreateForm/defaultData';
import { sortArrayByAlphabet } from '@/src/lib/utils/main';
import { Section } from '../products/CreateForm/sections/Section';
import { sortArrayByKey } from '../products/CreateForm/utils';
import { Menu } from '../products/CreateForm/RightMenu/Menu';
import { Flexbox } from '../../commons/Flexbox';
import { AddressForm } from '../../account/profile/Address/AddressForm';
import Invoices from './Invoices';

const Root = styled.div`
  overflow: auto;
  position: relative;
`;
const ArticleInput = styled.span`
  margin-left: 20px;
  margin-bottom: 20px;
  background-color: transparent;
  border: none;
  font-size: 30px;
  border: 1px solid transparent;
  &:focus {
    outline: none;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

interface Props {
  initialCustomer?: ICustomer;
}

const CustomerDetail = ({ initialCustomer }: Props) => {
  const { form, onInitForm, onInputChange, onDirectMutation } =
    useForm<ICustomer>(initialCustomer ?? ({} as any));
  const t = useTranslations();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialCustomer) {
      onInitForm(initialCustomer);
    } else {
      const newCustomer = generateDefaultCustomer();
      onInitForm(newCustomer);
    }
  }, [initialCustomer]);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (initialCustomer?._id) {
        const { error } = await onUpdateDocument(
          form,
          ENUM_COLLECTIONS.CUSTOMERS,
          initialCustomer._id
        );
        if (error) {
          toast.error(error);
        }
      } else {
        const payload = await onCreateDocument(
          form,
          ENUM_COLLECTIONS.CUSTOMERS
        );
        router.replace(`${ENUM_ROUTES.CUSTOMERS}/${payload.data?._id}`);
      }
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };
  const handleDelete = async (bookingId?: string) => {
    if (!bookingId) return;
    try {
      await onDeleteDocument(ENUM_COLLECTIONS.CUSTOMERS, bookingId);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  const handleAddSection = () => {
    const newSection = defaultSection(t);
    onDirectMutation((prev) => ({
      ...prev,
      sections: sortArrayByAlphabet(
        [...(prev.sections || []), newSection],
        'title'
      )
    }));
  };
  const handleArchiveSection = (sectionId: string) => {
    onDirectMutation((prev) => {
      const updatedSections = sortArrayByKey(
        prev.sections.map((prevSection) =>
          prevSection.id === sectionId
            ? { ...prevSection, isArchived: !prevSection.isArchived }
            : prevSection
        ),
        'isArchived'
      );
      return {
        ...prev,
        sections: updatedSections as ISection[]
      };
    });
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
      onDirectMutation((prev) => ({
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
      onDirectMutation((prev) => ({
        ...prev,
        sections: updatedSections
      }));
    },
    [form.sections]
  );
  const handleMovePropertyUp = useCallback(
    (propertyId: string, sectionId: string) => {
      onDirectMutation((prevForm) => {
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
      onDirectMutation((prevForm) => {
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
  const handleSelectCategory = (categoryId: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      sections: [...prev.sections],
      categories: [...(prev.categories ?? []), categoryId]
    }));
  };
  const handleSelectSections = (sections: ISection[]) => {
    onDirectMutation((prev) => ({
      ...prev,
      sections: [...prev.sections, ...sections]
    }));
  };
  const handleEditAddresses = (updatedAddresses: IAddress[]) => {
    onDirectMutation((prev) => ({
      ...prev,
      addresses: updatedAddresses
    }));
  };
  return (
    <Root>
      <CreateFormHeader
        onSubmit={handleSubmit}
        form={form}
        saving={saving}
        onDelete={handleDelete}
        onNameChange={onInputChange}
        onAddSection={handleAddSection}
        headerTitle='Title'
        InputHeader={
          <Flexbox>
            <ArticleInput>{form.firstname}</ArticleInput>
            <ArticleInput>{form.lastname}</ArticleInput>
          </Flexbox>
        }
      />
      <Flexbox>
        <Flexbox
          flex='1'
          flexDirection='column'
          style={{
            marginRight: '10px'
          }}>
          <Article headerTitle={t('Customer.identity')}>
            <InputGroup
              onInputChange={onInputChange}
              label={t('commons.companyName')}
              name='companyName'
              id='companyName'
              value={form.companyName ?? ''}
            />
            <InputGroup
              onInputChange={onInputChange}
              label={t('commons.firstname')}
              name='firstname'
              id='firstname'
              value={form.firstname ?? ''}
            />
            <InputGroup
              onInputChange={onInputChange}
              label={t('commons.name')}
              name='lastname'
              id='lastname'
              value={form.lastname ?? ''}
            />
            <InputGroup
              onInputChange={onInputChange}
              label={t('commons.email')}
              name='email'
              id='email'
              value={form.email ?? ''}
            />
            <InputGroup
              onInputChange={onInputChange}
              label={t('commons.mobile')}
              name='mobile'
              id='mobile'
              value={form.mobile ?? ''}
            />
          </Article>
          <Article headerTitle={t('AddressForm.addresses')}>
            <AddressForm
              prevAddresses={form.addresses ?? []}
              onUpdate={handleEditAddresses}
            />
          </Article>
          <Article headerTitle={t('Invoice.invoices')}>
            <Invoices invoiceIds={form.invoices || []} />
          </Article>
          {form.sections?.map((section, key) => (
            <Section
              section={section}
              sectionArrayIndex={key}
              sectionsLength={form.sections.length}
              key={key}
              onUpdateSection={onDirectMutation as any}
              onArchiveSection={handleArchiveSection}
              onMoveSectionDown={handleMoveSectionDown}
              onMoveSectionUp={handleMoveSectionUp}
              onMovePropertyDown={handleMovePropertyDown}
              onMovePropertyUp={handleMovePropertyUp}
            />
          ))}
        </Flexbox>

        <Menu
          onSelectCategory={handleSelectCategory}
          previousSelectedCategories={form.categories ?? []}
          onSelectSections={handleSelectSections}
        />
      </Flexbox>
    </Root>
  );
};

export default CustomerDetail;
