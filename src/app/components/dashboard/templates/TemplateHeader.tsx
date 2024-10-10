import React, { ChangeEvent, useMemo } from 'react';
import styled from '@emotion/styled';
import { SubmitButton } from '../products/CreateForm/SubmitButton';
import { Button } from '../../commons/Buttons/Button';
import { useTranslations } from 'next-intl';
import { DeleteConfirmation } from '../../commons/confirmation/DeleteConfirmation';
import { IAction } from '../../commons/confirmation/types';
import { ITemplate } from '@/src/types/DBTypes';
import { Flexbox } from '../../commons/Flexbox';
import { CategoryTags } from '../products/categories/CategoryTags';

const Root = styled.header``;

const TemplateNameInput = styled.input`
  width: fit-content;
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
  onSaveTemplate: () => void;
  onDeleteTemplate: (templateId?: string) => void;
  template: ITemplate;
  onAddSection: VoidFunction;
  onTemplateNameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDeleteCategory: (categoryId: string) => void;
}

export const TemplateHeader = ({
  onSaveTemplate,
  onDeleteTemplate,
  template,
  onAddSection,
  onTemplateNameChange,
  onDeleteCategory,
}: Props) => {
  const t = useTranslations('Template');
  const tCommons = useTranslations('commons');
  const tProductForm = useTranslations('ProductForm');

  const actions: IAction[] = useMemo(
    () => [
      {
        label: tCommons('delete'),
        style: {
          backgroundColor: 'var(--error-color)',
        },
        callback: async () => onDeleteTemplate(template._id),
      },
    ],
    [template._id]
  );

  return (
    <Root>
      <Flexbox
        flex='1'
        justifyContent='space-between'
        alignItems='center'
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          marginBottom: '10px',
        }}>
        <SubmitButton onClick={onSaveTemplate} />
        <DeleteConfirmation
          withLabel
          actions={actions}
          headerTitle={t('deleteTemplate')}
        />
      </Flexbox>
      <Flexbox
        flexDirection='column'
        style={{
          marginLeft: '10px',
        }}>
        <TemplateNameInput
          name='title'
          onChange={onTemplateNameChange}
          value={template.title || ''}
        />
        <CategoryTags
          categoriesIds={template.categories}
          onDeleteCategory={onDeleteCategory}
        />
        <Button
          style={{
            marginTop: '10px',
          }}
          onClick={onAddSection}>
          {tProductForm('addSection')}
        </Button>
      </Flexbox>
    </Root>
  );
};
