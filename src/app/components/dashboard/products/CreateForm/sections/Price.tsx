import { InputGroup } from '@/src/app/components/commons/form/InputGroup';
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

export const Price = ({ form, onInputChange }: Props) => {
  const t = useTranslations('ProductForm');

  return (
    <Article title={t('price' as any)}>
      <Form>
        <InputGroup
          id='price'
          type='number'
          name='price'
          label={t('price')}
          value={form.price}
          onInputChange={onInputChange}
        />
      </Form>
    </Article>
  );
};
