'use client';

import React from 'react';
import styled from '@emotion/styled';
import { InputGroup } from '../../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { upsertProduct } from '@/src/app/[locale]/dashboard/products/actions';
import { SubmitButton } from './SubmitButton';

const Form = styled.form``;

export const CreateForm = () => {
  const t = useTranslations();

  return (
    <div>
      <Form action={upsertProduct}>
        <InputGroup
          id='firstname'
          name='firstname'
          label={t('AddressForm.billing')}
        />
        <SubmitButton />
      </Form>
    </div>
  );
};
