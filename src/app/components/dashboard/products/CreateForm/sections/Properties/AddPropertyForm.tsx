import { IProperty } from '@/src/types/DBTypes';
import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { Selectbox } from '@/src/app/components/commons/form/Selectbox';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { defaultProperty } from '../../defaultData';

const options = [
  {
    label: 'Selectionner',
    value: '',
  },
  {
    label: 'Champs texte',
    value: 'INPUT',
  },
  {
    label: 'Champs numérique',
    value: 'NUMERIC',
  },
  {
    label: 'Long texte',
    value: 'TEXTAREA',
  },
];

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
const Root = styled.form``;

interface Props {
  onSubmit: (property: IProperty) => void;
  property?: IProperty;
  onClose: VoidFunction;
}

export const AddPropertyForm = ({ onSubmit, onClose }: Props) => {
  const defaultProp = defaultProperty();
  const tCommons = useTranslations('commons');
  const tProperty = useTranslations('PropertyForm');
  const tProduct = useTranslations('ProductForm');
  const [property, setProperty] = useState<IProperty>(defaultProp);

  const handleSubmit = () => {
    onSubmit(property);
  };
  const handleCancel = () => {
    setProperty(defaultProp);
    onClose();
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.currentTarget;
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const technicalName = parseTechnicalName(event.currentTarget.value);
    setProperty((prev) => ({
      ...prev,
      technicalName,
    }));
  };

  return (
    <>
      <Root>
        <InputGroup
          id='label'
          name='label'
          label={tCommons('label')}
          onInputChange={handleInputChange}
          value={property.label}
          onBlur={handleBlur}
        />
        <InputGroup
          id='technicalName'
          name='technicalName'
          label={tProduct('name')}
          onInputChange={handleInputChange}
          value={property.technicalName}
        />
        <Selectbox
          id='component'
          name='component'
          label={tProperty('component')}
          options={options}
          onSelectOption={handleInputChange}
          value={property.component}
        />
      </Root>
      <Flexbox justifyContent='flex-end'>
        <button type='button' className='button' onClick={handleSubmit}>
          {tProduct('addProperty')}
        </button>
        <button
          type='button'
          className='button button-cancel'
          onClick={handleCancel}>
          {tCommons('cancel')}
        </button>
      </Flexbox>
    </>
  );
};
