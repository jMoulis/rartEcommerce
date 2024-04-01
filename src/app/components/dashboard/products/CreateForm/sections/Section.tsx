import {
  IProductService,
  IProperty,
  ISection,
  ITemplate,
} from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React, {
  ChangeEvent,
  Fragment,
  useCallback,
  useRef,
  useState,
} from 'react';
import { renderProperties } from './Properties/renderProperties';
import { Dialog } from '@mui/material';
import { DialogHeader } from '@/src/app/components/commons/dialog/DialogHeader';
import { DialogContent } from '@/src/app/components/commons/dialog/DialogContent';
import { AddPropertyForm } from './Properties/AddPropertyForm';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import styled from '@emotion/styled';
import { SectionToolbar } from './SectionToolbar';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { EditButton } from './EditButton';
import { Backdrop } from '@/src/app/components/commons/Backdrop';
import { faArrowAltDown, faArrowAltUp } from '@fortawesome/pro-light-svg-icons';
import { Article } from '../Article';

const Content = styled.div<{ blur?: boolean }>`
  flex-direction: column;
  position: relative;
  filter: ${({ blur }) => (blur ? 'blur(0.7px)' : 'none')};
  transition: filter 0.3s;
  flex: 1;
`;

const PropertyWrapper = styled(Flexbox)`
  label: PropertyWrapper;
  position: relative;
  &:hover {
    .edit-button {
      display: flex;
    }
  }
`;

const InputsWrapper = styled(Flexbox)`
  display: flex;
  flex-wrap: wrap;
`;
type CustomChangeEvent = ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
>;

interface Props {
  section: ISection;
  sectionArrayIndex: number;
  onUpdateSection: React.Dispatch<
    React.SetStateAction<IProductService | ITemplate>
  >;
  onArchiveSection: (sectionID: string) => void;
  onMoveSectionUp: (sectionId: string) => void;
  onMoveSectionDown: (sectionID: string) => void;
  onMovePropertyUp: (propertyId: string, sectionId: string) => void;
  onMovePropertyDown: (propertyId: string, sectionId: string) => void;
  sectionsLength: number;
  noPublished?: boolean;
}

export const Section = ({
  section,
  onUpdateSection,
  onArchiveSection,
  onMoveSectionDown,
  onMoveSectionUp,
  onMovePropertyUp,
  onMovePropertyDown,
  sectionArrayIndex,
  sectionsLength,
  noPublished,
}: Props) => {
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();
  const [selectedEditProperty, setSelectedEditProperty] =
    useState<IProperty | null>(null);
  const [collapsed, setCollapsed] = useState(true);

  const articleRef = useRef<any | null>(null);

  const handlePropertyChange = useCallback(
    (event: CustomChangeEvent, propertyId: string) => {
      const { value, id } = event.currentTarget;

      onUpdateSection((prev) => {
        const prevSection = prev.sections.find(
          (prevSection) => prevSection.id === section.id
        );
        if (!prevSection) return prev;

        const propertyToUpdate = prevSection.properties.find(
          (prev) => prev.id === propertyId
        );

        if (!propertyToUpdate) return prev;

        const updatedProperty: IProperty = {
          ...propertyToUpdate,
          elements: propertyToUpdate.elements.map((prevElement) =>
            prevElement.id === id
              ? {
                  ...prevElement,
                  value,
                }
              : prevElement
          ),
        };

        const updatedSection = {
          ...prevSection,
          properties: prevSection.properties.map((prev) =>
            prev.id === propertyId ? updatedProperty : prev
          ),
        };

        return {
          ...prev,
          sections: prev.sections.map((prevSection) =>
            prevSection.id === updatedSection.id ? updatedSection : prevSection
          ),
        };
      });
    },
    []
  );
  const handleArchiveSection = useCallback(() => {
    onArchiveSection(section.id);
  }, [section.id]);
  const handleEditProperty = (propertyId: string) => {
    onOpen();
    const property = section.properties.find((prev) => prev.id === propertyId);
    setSelectedEditProperty(property ?? null);
  };
  const renderProperty = useCallback(
    (property: IProperty, propertyIndex: number) => {
      const propertiesLength = section.properties.length;
      return (
        <PropertyWrapper alignItems='center' key={propertyIndex}>
          <InputsWrapper flexDirection={property.align ?? 'column'} flex='1'>
            {property.elements.map((element, key) => {
              if (!renderProperties[element.component]) return null;
              return (
                <Fragment key={key}>
                  {renderProperties[element.component]({
                    label: element.label,
                    id: element.id,
                    propertyId: property.id,
                    name: element.technicalName,
                    className: property.align,
                    onSelectOption: () => {},
                    onChangeSelectbox: (event: CustomChangeEvent) => {},
                    options: [],
                    editable: true,
                    refIds: element.refIds ?? [],
                    onInputChange: (event: CustomChangeEvent) =>
                      handlePropertyChange(event, property.id),
                    value: element.value ?? '',
                  })}
                </Fragment>
              );
            })}
          </InputsWrapper>
          <Flexbox style={{ position: 'absolute', right: 0, top: 0 }}>
            <EditButton
              disabled={false}
              onClick={() => handleEditProperty(property.id)}
              backgroundColor='var(--primary-color)'
            />
            <EditButton
              icon={faArrowAltUp}
              onClick={() => onMovePropertyUp(property.id, section.id)}
              disabled={propertyIndex === 0}
            />
            <EditButton
              disabled={propertyIndex === propertiesLength - 1}
              icon={faArrowAltDown}
              onClick={() => onMovePropertyDown(property.id, section.id)}
            />
          </Flexbox>
        </PropertyWrapper>
      );
    },
    []
  );
  const handleAddProperty = (property: IProperty) => {
    onUpdateSection((prev) => {
      const prevSection = prev.sections.find(
        (prevSection) => prevSection.id === section.id
      );
      if (!prevSection) return prev;

      const updatedSection = {
        ...prevSection,
        properties: [...prevSection.properties, property],
      };
      return {
        ...prev,
        sections: prev.sections.map((prevSection) =>
          prevSection.id === updatedSection.id ? updatedSection : prevSection
        ),
      };
    });
    setSelectedEditProperty(null);
  };
  const handleSubmitEdit = (editProperty: IProperty) => {
    onUpdateSection((prev) => {
      const prevSection = prev.sections.find(
        (prevSection) => prevSection.id === section.id
      );
      if (!prevSection) return prev;

      const updatedSection = {
        ...prevSection,
        properties: prevSection.properties.map((prevProp) =>
          prevProp.id === editProperty.id ? editProperty : prevProp
        ),
      };

      return {
        ...prev,
        sections: prev.sections.map((prevSection) =>
          prevSection.id === updatedSection.id ? updatedSection : prevSection
        ),
      };
    });
    setSelectedEditProperty(null);
  };
  const handleChangeSectionName = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    onUpdateSection((prev) => {
      const prevSection = prev.sections.find(
        (prevSection) => prevSection.id === section.id
      );
      if (!prevSection) return prev;

      const updatedSection = {
        ...prevSection,
        title: value,
      };
      return {
        ...prev,
        sections: prev.sections.map((prevSection) =>
          prevSection.id === updatedSection.id ? updatedSection : prevSection
        ),
      };
    });
  };
  const handleDeleteProperty = (deletePropertyId: string) => {
    onUpdateSection((prev) => {
      const prevSection = prev.sections.find(
        (prevSection) => prevSection.id === section.id
      );
      if (!prevSection) return prev;

      const updatedSection = {
        ...prevSection,
        properties: prevSection.properties.filter(
          (prevProp) => prevProp.id !== deletePropertyId
        ),
      };

      return {
        ...prev,
        sections: prev.sections.map((prevSection) =>
          prevSection.id === updatedSection.id ? updatedSection : prevSection
        ),
      };
    });
    setSelectedEditProperty(null);
  };
  const handleDeleteSection = (sectionId: string) => {
    onUpdateSection((prev) => {
      return {
        ...prev,
        sections: prev.sections.filter(
          (prevSection) => prevSection.id !== sectionId
        ),
      };
    });
    setSelectedEditProperty(null);
  };
  const handlePublishSection = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked, name } = event.currentTarget;
    onUpdateSection((prev) => {
      return {
        ...prev,
        sections: prev.sections.map((prevSection) =>
          prevSection.id === section.id
            ? {
                ...prevSection,
                [name]: checked,
              }
            : prevSection
        ),
      };
    });
  };
  const handleToggle = () => {
    const status = articleRef.current?.onToggle?.();
    setCollapsed(status);
  };

  const handleClose = () => {
    onClose();
    setSelectedEditProperty(null);
  };
  return (
    <>
      <Article
        ref={articleRef}
        styling={{
          root: {
            marginRight: '10px',
          },
        }}
        Header={
          <SectionToolbar
            section={section}
            onArchive={handleArchiveSection}
            onChangeSectionName={handleChangeSectionName}
            onPublishSection={handlePublishSection}
            onOpenAddProperty={onOpen}
            onMoveSectionDown={onMoveSectionDown}
            onMoveSectionUp={onMoveSectionUp}
            sectionArrayIndex={sectionArrayIndex}
            sectionsLength={sectionsLength}
            onDeleteSection={handleDeleteSection}
            onToggle={handleToggle}
            openCollapse={collapsed}
            noPublished={noPublished}
          />
        }>
        <Content blur={section.isArchived}>
          <Backdrop open={section.isArchived} radius='0 0 10px 10px' />
          {section.properties.map((property, key) =>
            renderProperty(property, key)
          )}
        </Content>
      </Article>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
        <DialogHeader
          title={t('ProductForm.addProperty')}
          onClose={handleClose}
        />
        <DialogContent
          height='50vh'
          style={{
            overflow: 'hidden',
          }}>
          <AddPropertyForm
            editProperty={
              section.properties.find(
                (prev) => prev.id === selectedEditProperty?.id
              ) ?? null
            }
            onSubmit={handleAddProperty}
            onDeleteProperty={handleDeleteProperty}
            onEditSubmit={handleSubmitEdit}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
