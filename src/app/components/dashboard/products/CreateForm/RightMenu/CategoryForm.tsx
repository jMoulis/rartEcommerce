import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { Button } from '@/src/app/components/commons/confirmation/Buttons/Button';
import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { useForm } from '@/src/app/components/hooks/useForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onCreateDocument } from '@/src/lib/firebase/firestore/crud';
import { ICategory } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {}

export const CategoryForm = (props: Props) => {
  const t = useTranslations();
  const { onInputChange, form, onSubmit } = useForm<ICategory>();

  const handleSubmit = async () => {
    const updatedForm = onSubmit();
    await onCreateDocument(updatedForm, ENUM_COLLECTIONS.CATEGORIES);
  };
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
          input: {
            padding: 0,
          },
        }}
        label={t('commons.color')}
      />
      <Flexbox>
        <Button onClick={handleSubmit}>{t('commons.save')}</Button>
      </Flexbox>
    </>
  );
};
