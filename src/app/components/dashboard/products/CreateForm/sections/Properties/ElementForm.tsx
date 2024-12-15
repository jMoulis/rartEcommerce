import React, { ChangeEvent, useEffect } from 'react';
import styled from '@emotion/styled';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { IElement, IProductService } from '@/src/types/DBTypes';
import { Selectbox } from '@/src/app/components/commons/form/Selectbox';
import { useTranslations } from 'next-intl';
import { InputGroupCheckbox } from '@/src/app/components/commons/form/InputCheckbox';
import { ENUM_PROPERTY_COMPONENT } from './enum';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { OptionCardForm } from '../../OptionsCard/OptionCardForm';
import { FullDialog } from '@/src/app/components/commons/dialog/FullDialog';
import { useOptions } from '@/src/app/components/hooks/useOptions';

const Root = styled.form`
  padding: 10px;
  border-radius: 8px;
  &:hover {
    background-color: rgba(0, 0, 255, 0.05);
  }
`;

const components = [
  {
    label: 'Selectionner',
    value: ''
  },
  {
    label: 'Champs texte',
    value: ENUM_PROPERTY_COMPONENT.INPUT
  },
  {
    label: 'Champs numérique',
    value: ENUM_PROPERTY_COMPONENT.NUMERIC
  },
  {
    label: 'Long texte',
    value: ENUM_PROPERTY_COMPONENT.TEXTAREA
  },
  {
    label: 'Liste déroulante',
    value: ENUM_PROPERTY_COMPONENT.SELECTBOX
  },
  {
    label: 'Liste miniature',
    value: ENUM_PROPERTY_COMPONENT.THUMBNAIL
  }
];
interface Props {
  element: IElement;
  onBlur: (event: ChangeEvent<HTMLInputElement>) => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onAddOption: (option: IProductService) => void;
}

export const ElementForm = ({
  element,
  onBlur,
  onInputChange,
  onAddOption
}: Props) => {
  const tCommons = useTranslations('commons');
  const tProperty = useTranslations('PropertyForm');
  const t = useTranslations();
  const { open, onOpen, onClose } = useToggle();
  const { onFetchOptions, options } = useOptions();

  useEffect(() => {
    if (element.component === ENUM_PROPERTY_COMPONENT.THUMBNAIL) {
      onFetchOptions(element.refIds ?? []);
    }
  }, [element.refIds, element.component]);

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
      <Selectbox
        id={`component-${element.id}`}
        name='component'
        label={tProperty('component')}
        options={components}
        onChangeSelectbox={onInputChange}
        value={element.component}
      />
      {element.refIds?.map((refId, key) => {
        return <span key={key}>{refId}</span>;
      })}
      <Button type='button' onClick={onOpen}>
        {t('ProductForm.addOption')}
      </Button>
      {options.map((option, key) => {
        return <span key={key}>{option.name}</span>;
      })}
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          maxWidth: 'lg'
        }}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh'
          }
        }}
        header={{
          title: t('ProductForm.addOption')
        }}>
        {open ? <OptionCardForm onAddOption={onAddOption} /> : null}
      </FullDialog>
      <InputGroupCheckbox
        id={`editable-${element.id}`}
        name='editable'
        label={tCommons('editable')}
        onInputChange={onInputChange}
        value={element.editable ?? false}
      />
    </Root>
  );
};
