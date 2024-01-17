import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
import { TextareaGroup } from '@/src/app/components/commons/form/TextareaGroup';
import { IProductService } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { Article } from './Article';

const Form = styled.form`
  flex: 1;
`;
interface Props {
  form: IProductService;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const Details = ({ form, onInputChange }: Props) => {
  const t = useTranslations('ProductForm');

  return (
    <Article title={t('productDetail' as any)}>
      <Form>
        <InputGroup
          id='name'
          name='name'
          label={t('name')}
          value={form.name}
          onInputChange={onInputChange}
        />
        <TextareaGroup
          id='description'
          name='description'
          label={t('description')}
          value={form.description}
          onInputChange={onInputChange}
          style={{
            minHeight: '150px',
          }}
        />
      </Form>
    </Article>
  );
};
