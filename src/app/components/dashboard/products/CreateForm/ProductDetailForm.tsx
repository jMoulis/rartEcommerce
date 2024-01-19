import React, { ChangeEvent } from 'react';
import { Article } from './Article';
import { useTranslations } from 'next-intl';
import { InputGroup } from '../../../commons/form/InputGroup';
import { IProductService } from '@/src/types/DBTypes';
import { TextareaGroup } from '../../../commons/form/TextareaGroup';
import { Flexbox } from '../../../commons/Flexbox';
import { CategoryTags } from '../categories/CategoryTags';

interface Props {
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  form: IProductService;
  onDeleteCategory: (form: IProductService) => void;
}

export const ProductDetailForm = ({
  form,
  onInputChange,
  onDeleteCategory,
}: Props) => {
  const t = useTranslations();
  const handleDeleteCategory = (categoryId: string) => {
    const updatedForm = {
      ...form,
      categories: form.categories.filter((prev) => prev !== categoryId),
    };
    onDeleteCategory(updatedForm);
  };

  return (
    <Article
      headerTitle={t('ProductForm.productDetail')}
      styling={{
        root: {
          flex: '1',
        },
      }}>
      <Flexbox flexDirection='column' flex='1'>
        <InputGroup
          name='name'
          id='name'
          value={form.name}
          onInputChange={onInputChange}
          label={t('ProductForm.name')}
        />
        <TextareaGroup
          name='description'
          id='description'
          value={form.description}
          onInputChange={onInputChange}
          label={t('ProductForm.description')}
        />
        <CategoryTags
          categoriesIds={form.categories}
          onDeleteCategory={handleDeleteCategory}
        />
      </Flexbox>
    </Article>
  );
};
