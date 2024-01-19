/* eslint-disable @typescript-eslint/return-await */
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { useForm } from '@/src/app/components/hooks/useForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ICategory } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React, { useEffect } from 'react';
import { useFirestore } from '@/src/app/contexts/firestore/useFirestore';
import { DeleteConfirmation } from '@/src/app/components/commons/confirmation/DeleteConfirmation';
import { IAction } from '@/src/app/components/commons/confirmation/types';

interface Props {
  editedCategory?: ICategory | null;
  onClose: VoidFunction;
}

export const CategoryForm = ({ editedCategory, onClose }: Props) => {
  const t = useTranslations();
  const { onInputChange, form, onInitForm } = useForm<ICategory>();
  const { onCreateDocument, onUpdateDocument, onDeleteDocument } =
    useFirestore();

  useEffect(() => {
    if (editedCategory) {
      onInitForm(editedCategory);
    }
  }, [editedCategory]);

  const handleSubmit = async () => {
    if (editedCategory?._id) {
      await onUpdateDocument(
        form,
        ENUM_COLLECTIONS.CATEGORIES,
        editedCategory._id
      );
      onClose?.();
    } else {
      await onCreateDocument(form, ENUM_COLLECTIONS.CATEGORIES);
      onClose?.();
    }
  };
  const handleDelete = async () => {
    if (editedCategory?._id) {
      await onDeleteDocument(ENUM_COLLECTIONS.CATEGORIES, editedCategory._id);
      onClose?.();
    }
  };

  const actions: IAction[] = [
    {
      label: t('commons.delete'),
      callback: async () => handleDelete(),
      style: {
        backgroundColor: 'var(--error-color)',
      },
    },
  ];

  return (
    <>
      <InputGroup
        id='category'
        name='name'
        label={t('ProductForm.name')}
        value={form.name}
        onInputChange={onInputChange}
      />
      <InputGroup
        type='color'
        id='color'
        name='color'
        onInputChange={onInputChange}
        styling={{
          root: {
            width: '50px',
          },
          input: {
            padding: 0,
          },
        }}
        label={t('commons.color')}
      />
      <Flexbox justifyContent='flex-end'>
        <Button onClick={handleSubmit}>{t('commons.save')}</Button>
        <DeleteConfirmation
          withLabel
          actions={actions}
          headerTitle={t('Category.deleteCategory')}>
          <p>{t('Category.deleteCategoryMessage.title')}</p>
          <p>{t('Category.deleteCategoryMessage.explanation')}</p>
        </DeleteConfirmation>
      </Flexbox>
    </>
  );
};
