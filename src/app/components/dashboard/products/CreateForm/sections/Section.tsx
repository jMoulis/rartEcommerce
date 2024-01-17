import { IProperty, ISection } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent, useCallback } from 'react';
import { renderProperties } from './Properties/renderProperties';
import { Dialog } from '@mui/material';
import { DialogHeader } from '@/src/app/components/commons/dialog/DialogHeader';
import { DialogContent } from '@/src/app/components/commons/dialog/DialogContent';
import { AddPropertyForm } from './Properties/AddPropertyForm';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { Input } from '@/src/app/components/commons/form/Input';

const Root = styled.section`
  border-radius: 10px;
  background-color: #fff;
  margin: 10px;
`;
const Header = styled.header`
  padding: 18px 24px 10px;
  border-bottom: 1px solid var(--card-header-border-color);
  justify-content: space-between;
  display: flex;
  align-items: center;
`;
const Content = styled.div`
  padding: 30px;
  display: flex;
  flex-direction: column;
`;
const CustomInputTitle = styled(Input)`
  border: 1px solid transparent;
`;
type CustomChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface Props {
  section: ISection;
  onUpdateSection: (section: ISection) => void;
  onArchiveSection: (sectionID: string) => void;
}

export const Section = ({
  section,
  onUpdateSection,
  onArchiveSection,
}: Props) => {
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();

  const handlePropertyChange = (event: CustomChangeEvent) => {
    const { value, id } = event.currentTarget;
    const propertyToUpdate = section.properties.find((prev) => prev.id === id);

    if (!propertyToUpdate) return null;

    const updatedProperty: IProperty = {
      ...propertyToUpdate,
      value,
    };
    const updatedSection = {
      ...section,
      properties: section.properties.map((prev) =>
        prev.id === id ? updatedProperty : prev
      ),
    };
    onUpdateSection(updatedSection);
  };

  const handleArchiveSection = useCallback(() => {
    onArchiveSection(section.id);
  }, [section.id]);

  const Property = useCallback(
    (property: IProperty) => {
      if (!renderProperties[property.component]) return null;
      return renderProperties[property.component]({
        label: property.label,
        id: property.id,
        name: property.technicalName,
        onBlur: handlePropertyChange,
        defaultValue: property.value,
      });
    },
    [handlePropertyChange]
  );

  const handleAddProperty = (property: IProperty) => {
    console.log(property);
    const updatedSection = {
      ...section,
      properties: [...section.properties, property],
    };
    onUpdateSection(updatedSection);
  };

  const handleChangeSectionName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const updatedSection = {
      ...section,
      title: value,
    };
    onUpdateSection(updatedSection);
  };

  return (
    <>
      <Root>
        <Header>
          <CustomInputTitle
            name='title'
            defaultValue={section.title}
            onBlur={handleChangeSectionName}
          />
          <Flexbox>
            <button type='button' className='button' onClick={onOpen}>
              {t('ProductForm.addProperty')}
            </button>
            <button
              type='button'
              className='button button-cancel'
              onClick={handleArchiveSection}>
              {t('commons.archives')}
            </button>
          </Flexbox>
        </Header>
        <Content>
          {section.properties.map((property, key) => (
            <Property key={key} {...property} />
          ))}
        </Content>
      </Root>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
        <DialogHeader title={t('ProductForm.addProperty')} onClose={onClose} />
        <DialogContent>
          <AddPropertyForm onSubmit={handleAddProperty} onClose={onClose} />
        </DialogContent>
      </Dialog>
    </>
  );
};
