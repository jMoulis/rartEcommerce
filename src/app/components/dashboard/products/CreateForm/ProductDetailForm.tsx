import React, { ChangeEvent } from 'react';
import { Article } from './Article';
import { useTranslations } from 'next-intl';
import { InputGroup } from '../../../commons/form/InputGroup';
import { IProductService } from '@/src/types/DBTypes';
import { TextareaGroup } from '../../../commons/form/TextareaGroup';
import { Flexbox } from '../../../commons/Flexbox';

interface Props {
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  form: IProductService;
}

export const ProductDetailForm = ({ form, onInputChange }: Props) => {
  const t = useTranslations();

  return (
    <Article headerTitle={t('ProductForm.productDetail')}>
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
      </Flexbox>
    </Article>
  );
};
