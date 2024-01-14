'use client';

import { IAddress } from '@/src/types/DBTypes';
import React, { ChangeEvent, useState } from 'react';
import { InputGroup } from '../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { v4 } from 'uuid';
import { Selectbox } from '../../commons/form/Selectbox';
import { InputGroupCheckbox } from '../../commons/form/InputCheckbox';

interface Props {
  onAddAddress: (address: IAddress) => void;
  selectedAddress: IAddress | null;
}

const defaultAddress = {
  id: v4(),
  name: '',
  streetNumber: '',
  route: '',
  locality: '',
  country: '',
  postalCode: '',
  default: false,
  type: 'shipping' as any,
};
export const AddAddressForm = ({ onAddAddress }: Props) => {
  const t = useTranslations();

  const [form, setForm] = useState<IAddress>(defaultAddress);
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleCheckDefault = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      default: checked,
    }));
  };
  const handleSubmitAddress = () => {
    onAddAddress(form);
    setForm(defaultAddress);
  };
  const handleCancelAddress = () => {
    setForm(defaultAddress);
  };
  return (
    <div>
      <InputGroupCheckbox
        label={t('AddressForm.default')}
        id='default'
        name='default'
        value={form.default}
        onInputChange={handleCheckDefault}
      />
      <InputGroup
        label={t('AddressForm.name')}
        id='name'
        name='name'
        value={form.name}
        onInputChange={handleInputChange}
      />
      <Selectbox
        label={t('AddressForm.addressType')}
        id='type'
        name='type'
        value={form.type}
        onSelectOption={handleInputChange}
        options={[
          {
            label: t('AddressForm.type', { type: 'shipping' }),
            value: 'shipping',
          },
          {
            label: t('AddressForm.type', { type: 'billing' }),
            value: 'billing',
          },
        ]}
      />
      <InputGroup
        label={t('AddressForm.streetNumber')}
        id='streetNumber'
        name='streetNumber'
        value={form.streetNumber}
        onInputChange={handleInputChange}
      />
      <InputGroup
        label={t('AddressForm.route')}
        id='route'
        name='route'
        value={form.route}
        onInputChange={handleInputChange}
      />
      <InputGroup
        label={t('AddressForm.postalCode')}
        id='postalCode'
        name='postalCode'
        value={form.postalCode}
        onInputChange={handleInputChange}
      />
      <InputGroup
        label={t('AddressForm.locality')}
        id='locality'
        name='locality'
        value={form.locality}
        onInputChange={handleInputChange}
      />
      <InputGroup
        label={t('AddressForm.country')}
        id='country'
        name='country'
        value={form.country}
        onInputChange={handleInputChange}
      />
      <button type='button' onClick={handleSubmitAddress}>
        {t('commons.create')}
      </button>
      <button type='button' onClick={handleCancelAddress}>
        {t('commons.cancel')}
      </button>
    </div>
  );
};
