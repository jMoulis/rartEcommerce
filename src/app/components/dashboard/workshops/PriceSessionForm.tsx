import React, { ChangeEvent } from 'react';
import styled from '@emotion/styled';
import { InputGroup } from '../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { IWorkshop } from '@/src/types/DBTypes';
import { Selectbox } from '../../commons/form/Selectbox';

const Root = styled.div``;

interface Props {
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  form: IWorkshop;
}

export const PriceSessionForm = ({ form, onInputChange }: Props) => {
  const t = useTranslations();

  return (
    <Root>
      <InputGroup
        id='price'
        type='number'
        name='price'
        label={t('commons.price')}
        onInputChange={onInputChange}
        value={form.price || ''}
      />
      <Selectbox
        label={t('Booking.paymentPreference')}
        name='paymentPreference'
        id='paymentPreference'
        value={form.paymentPreference}
        onChangeSelectbox={onInputChange}
        options={[
          {
            label: t('commons.select', {
              type: 'select',
            }),
            value: '',
          },
          {
            label: t('Booking.paymentPreferenceSelect', {
              type: 'online',
            }),
            value: 'online',
          },
          {
            label: t('Booking.paymentPreferenceSelect', {
              type: 'person',
            }),
            value: 'person',
          },
        ]}
      />
    </Root>
  );
};
