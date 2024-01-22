'use client';

import { IAddress } from '@/src/types/DBTypes';
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { InputGroup } from '../../../commons/form/InputGroup';
import { useTranslations } from 'next-intl';
import { v4 } from 'uuid';
import { Selectbox } from '../../../commons/form/Selectbox';
import { InputGroupCheckbox } from '../../../commons/form/InputCheckbox';
import styled from '@emotion/styled';
import { DeleteConfirmation } from '../../../commons/confirmation/DeleteConfirmation';
import { Button } from '../../../commons/Buttons/Button';
import { Flexbox } from '../../../commons/Flexbox';
import { CancelButton } from '../../../commons/Buttons/CancelButton';

const Form = styled.form`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
`;

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

interface Props {
  onUpsertAddress: (address: IAddress, edit?: boolean) => void;
  selectedAddress: IAddress | null;
  onDeleteAddress: (addressId: string) => void;
  onCancel: () => void;
  noType?: boolean;
  noDefault?: boolean;
}
export const AddAddressForm = ({
  selectedAddress,
  onUpsertAddress,
  onDeleteAddress,
  onCancel,
  noType,
  noDefault,
}: Props) => {
  const t = useTranslations();
  const actions = useRef([
    {
      label: t('commons.delete'),
      callback: async () => {
        if (!selectedAddress?._id) return;
        onDeleteAddress(selectedAddress._id);
      },
    },
  ]);
  const [form, setForm] = useState<IAddress>(defaultAddress);

  useEffect(() => {
    if (selectedAddress) {
      setForm(selectedAddress);
    }
  }, [selectedAddress]);

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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedAddress) {
      onUpsertAddress(form, true);
    } else {
      onUpsertAddress(form);
      setForm(defaultAddress);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {noDefault ? null : (
        <InputGroupCheckbox
          label={t('AddressForm.default')}
          id='default'
          name='default'
          value={form.default ?? false}
          onInputChange={handleCheckDefault}
        />
      )}
      <InputGroup
        label={t('AddressForm.name')}
        id='name'
        name='name'
        value={form.name}
        onInputChange={handleInputChange}
      />
      {noType ? null : (
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
      )}
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
      <Flexbox justifyContent='flex-end'>
        <Button type='submit'>
          {selectedAddress ? t('commons.edit') : t('commons.create')}
        </Button>
        <DeleteConfirmation
          withLabel
          headerTitle={t('AddressForm.deleteAddress')}
          actions={actions.current}
        />
        <CancelButton type='button' onClick={onCancel}>
          {t('commons.cancel')}
        </CancelButton>
      </Flexbox>
    </Form>
  );
};
