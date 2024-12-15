import { IProductService, IProperty } from '@/src/types/DBTypes';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { defaultElement, defaultProperty } from '../../defaultData';
import { ElementForm } from './ElementForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faDistributeSpacingHorizontal,
  faDistributeSpacingVertical
} from '@fortawesome/pro-light-svg-icons';
import { AlignButton } from './AlignButton';
import { RoundedButtonWrapper } from './RoundedButtonWrapper';
import { DeleteConfirmation } from '@/src/app/components/commons/confirmation/DeleteConfirmation';
import { Button } from '@/src/app/components/commons/Buttons/Button';

const parseTechnicalName = (label: string) => {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .toLowerCase()
    .split(' ')
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join('');
};

const ElementList = styled.ul`
  margin-top: 20px;
  overflow: auto;
  max-height: calc(50vh - 80px);
`;

interface Props {
  onSubmit: (property: IProperty) => void;
  onEditSubmit: (property: IProperty) => void;
  onDeleteProperty: (propertyId: string) => void;
  property?: IProperty;
  onClose: VoidFunction;
  editProperty: IProperty | null;
}

export const AddPropertyForm = ({
  onSubmit,
  onClose,
  editProperty,
  onEditSubmit,
  onDeleteProperty
}: Props) => {
  const defaultProp = defaultProperty();
  const tCommons = useTranslations('commons');
  const tProperty = useTranslations('PropertyForm');
  const [property, setProperty] = useState<IProperty>(defaultProp);

  const actions = useRef([
    {
      label: tCommons('delete'),
      className: 'button button-delete',
      callback: async () => {
        if (!editProperty) return;
        onClose();
        onDeleteProperty(editProperty.id);
      }
    }
  ]);
  useEffect(() => {
    if (editProperty) {
      setProperty(editProperty);
    } else {
      setProperty(defaultProp);
    }
  }, [editProperty]);

  const handleSubmit = () => {
    if (editProperty) {
      onEditSubmit(property);
    } else {
      onSubmit(property);
    }
    onClose();
  };
  const handleCancel = () => {
    setProperty(defaultProp);
    onClose();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    elementId: string
  ) => {
    const { name, value, type } = event.currentTarget;
    const savedValue =
      type === 'checkbox' ? (event.currentTarget as any).checked : value;
    setProperty((prev) => ({
      ...prev,
      elements: prev.elements.map((prevElement) =>
        prevElement.id === elementId
          ? { ...prevElement, [name]: savedValue }
          : prevElement
      )
    }));
  };

  const handleBlur = (
    event: ChangeEvent<HTMLInputElement>,
    elementId: string
  ) => {
    const technicalName = parseTechnicalName(event.currentTarget.value);
    setProperty((prev) => ({
      ...prev,
      elements: prev.elements.map((prevElement) =>
        prevElement.id === elementId
          ? { ...prevElement, technicalName }
          : prevElement
      )
    }));
  };
  const handleAddElement = () => {
    const newElement = defaultElement();
    setProperty((prev) => ({
      ...prev,
      elements: [...prev.elements, newElement]
    }));
  };
  const handleSwitchAlign = (align: 'row' | 'column') => {
    setProperty((prev) => ({
      ...prev,
      align
    }));
  };
  const handleAddOption = (option: IProductService) => {
    setProperty((prev) => {
      return {
        ...prev,
        elements: prev.elements.map((element) => {
          if (element.refIds) {
            if (element.refIds.includes(option._id!)) {
              // Remove refId if it already exists
              return {
                ...element,
                refIds: element.refIds.filter((id) => id !== option._id!)
              };
            } else {
              // Add refId if it doesn't exist
              return {
                ...element,
                refIds: [...element.refIds, option._id!]
              };
            }
          } else {
            // Create and add refId if it doesn't exist
            return {
              ...element,
              refIds: [option._id!]
            };
          }
        })
      };
    });
  };

  return (
    <>
      <Flexbox flexDirection='column' flex='1'>
        <Flexbox>
          <Button type='button' onClick={handleAddElement}>
            {tProperty('addField')}
          </Button>
          <RoundedButtonWrapper>
            <AlignButton
              type='button'
              selected={property.align === 'row'}
              onClick={() => handleSwitchAlign('row')}>
              <FontAwesomeIcon icon={faDistributeSpacingVertical as any} />
            </AlignButton>
            <AlignButton
              type='button'
              selected={property.align === 'column'}
              onClick={() => handleSwitchAlign('column')}>
              <FontAwesomeIcon icon={faDistributeSpacingHorizontal as any} />
            </AlignButton>
          </RoundedButtonWrapper>
        </Flexbox>
        <ElementList>
          {property.elements.map((element, key) => (
            <li key={key}>
              <ElementForm
                onAddOption={handleAddOption}
                element={element}
                onBlur={(event) => handleBlur(event, element.id)}
                onInputChange={(event) => handleInputChange(event, element.id)}
              />
            </li>
          ))}
        </ElementList>
      </Flexbox>

      <Flexbox
        justifyContent='flex-end'
        style={{
          padding: '10px'
        }}>
        <Button type='button' onClick={handleSubmit}>
          {tCommons(editProperty ? 'edit' : 'create')}
        </Button>
        {editProperty ? (
          <DeleteConfirmation
            withLabel
            headerTitle={tProperty('deleteProperty')}
            actions={actions.current}>
            <p>{tProperty('deletePropertyMessage.title')}</p>
            <p>{tProperty('deletePropertyMessage.explanation')}</p>
          </DeleteConfirmation>
        ) : null}
        <Button type='button' className=' button-cancel' onClick={handleCancel}>
          {tCommons('cancel')}
        </Button>
      </Flexbox>
    </>
  );
};
