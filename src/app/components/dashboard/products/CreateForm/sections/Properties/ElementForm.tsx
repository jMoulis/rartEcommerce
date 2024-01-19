import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { IElement } from '@/src/types/DBTypes';
import { Selectbox } from '@/src/app/components/commons/form/Selectbox';
import { useTranslations } from 'next-intl';

const Root = styled.form`
  padding: 10px;
  border-radius: 8px;
  &:hover {
    background-color: rgba(0, 0, 255, 0.05);
  }
`;

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
interface Props {
  element: IElement;
  onBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const ElementForm = ({ element, onBlur, onInputChange }: Props) => {
  const tCommons = useTranslations('commons');
  const tProperty = useTranslations('PropertyForm');
  const tProduct = useTranslations('ProductForm');
  return (
    <Root>
      <InputGroup
        id={`label-${element.id}`}
        name='label'
        label={tCommons('label')}
        onInputChange={onInputChange}
        value={element.label}
        onBlur={onBlur}
      />
      <InputGroup
        id={`technicalName-${element.id}`}
        name='technicalName'
        label={tProduct('name')}
        onInputChange={onInputChange}
        value={element.technicalName}
      />
      <Selectbox
        id={`component-${element.id}`}
        name='component'
        label={tProperty('component')}
        options={options}
        onSelectOption={onInputChange}
        value={element.component}
      />
    </Root>
  );
};
