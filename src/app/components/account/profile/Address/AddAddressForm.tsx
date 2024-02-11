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
import { v4 } from 'uuid';
import { Selectbox } from '../../../commons/form/Selectbox';
import { InputGroupCheckbox } from '../../../commons/form/InputCheckbox';
import styled from '@emotion/styled';
import { DeleteConfirmation } from '../../../commons/confirmation/DeleteConfirmation';
import { Button } from '../../../commons/Buttons/Button';
import { Flexbox } from '../../../commons/Flexbox';
import { CancelButton } from '../../../commons/Buttons/CancelButton';
// import Autocomplete from './Autocomplete';
import { useConfirmAddress, config } from '@mapbox/search-js-react';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const Form = styled.form`
  background-color: #fff;
  border-radius: 8px;
`;

const defaultAddress = {
  id: v4(),
  name: '',
  address: '',
  route: '',
  streetNumber: '',
  additional: '',
  locality: '',
  country: '',
  postalCode: '',
  default: false,
  type: 'shipping' as any,
};

const Autocomplete = dynamic(async () => import('./Autocomplete'), {
  ssr: false,
});
interface Props {
  onUpsertAddress: (address: IAddress, edit?: boolean) => void;
  selectedAddress: IAddress | null;
  onDeleteAddress?: (addressId: string) => void;
  onCancel?: () => void;
  noType?: boolean;
  children?: any;
  noDefault?: boolean;
  noLabel?: boolean;
  submitButton?: {
    title?: string;
  };
  cancelButton?: {
    title?: string;
  };
  deleteButton?: {
    title?: string;
  };
}
export const AddAddressForm = ({
  selectedAddress,
  onUpsertAddress,
  onDeleteAddress,
  onCancel,
  noType,
  noDefault,
  noLabel,
  cancelButton,
  submitButton,
  deleteButton,
  children,
}: Props) => {
  const tokenRef = useRef<string>(`${process.env.NEXT_PUBLIC_MAPBOX}`);
  const locale = useLocale();
  useEffect(() => {
    config.accessToken = tokenRef.current;
  }, []);

  const t = useTranslations();
  const actions = useRef([
    {
      label: deleteButton?.title ?? t('commons.delete'),
      callback: async () => {
        if (!selectedAddress?._id) return;
        onDeleteAddress?.(selectedAddress._id);
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
    const result = await showConfirm();
    if (result.type === 'nochange') {
      if (selectedAddress) {
        onUpsertAddress(form, true);
      } else {
        onUpsertAddress(form);
        setForm(defaultAddress);
      }
    }
  };

  const { formRef, showConfirm } = useConfirmAddress({
    minimap: true,
    options: {
      language: locale,
    },
    skipConfirmModal: (feature) => {
      return ['exact', 'high'].includes(
        feature.properties.match_code.confidence
      );
    },
  });

  const handleSelectAddress = (res: any) => {
    const feature = res.features[0];

    setForm((prev) => ({
      ...prev,
      route: feature.properties.street,
      locality: feature.properties.address_level2,
      country: feature.properties.country,
      countryCode: feature.properties.country_code,
      postalCode: feature.properties.postcode,
      streetNumber: feature.properties.address_number,
    }));
  };

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      {children}
      <Autocomplete
        token={tokenRef.current}
        placeholder={`${t('AddressForm.autofillAddress')}`}
        value={form.address}
        onChange={handleInputChange}
        onSelectAddress={handleSelectAddress}
        required
        name='address'
        id='address'
        labelTip={`(${t('AddressForm.streetNumberStreet')})`}
        label={t('AddressForm.address')}
      />
      {noDefault ? null : (
        <InputGroupCheckbox
          label={t('AddressForm.default')}
          id='default'
          name='default'
          value={form.default ?? false}
          onInputChange={handleCheckDefault}
        />
      )}
      {noLabel ? null : (
        <InputGroup
          label={t('AddressForm.name')}
          id='name'
          name='name'
          value={form.name || ''}
          onInputChange={handleInputChange}
        />
      )}
      {noType ? null : (
        <Selectbox
          label={t('AddressForm.addressType')}
          id='type'
          name='type'
          value={form.type || ''}
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
        label={t('AddressForm.additional')}
        id='additional'
        name='additional'
        value={form.additional ?? ''}
        onInputChange={handleInputChange}
        placeholder={t('AddressForm.additionalPlaceholder')}
      />
      <InputGroup
        styling={{
          root: {
            visibility: 'hidden',
            margin: 0,
            height: 0,
          },
        }}
        type='hidden'
        label={t('AddressForm.streetNumber')}
        id='streetNumber'
        name='streetNumber'
        value={form.streetNumber || ''}
        onInputChange={handleInputChange}
        autoComplete='address-number'
        required
      />
      <InputGroup
        label={t('AddressForm.postalCode')}
        id='postalCode'
        name='postalCode'
        value={form.postalCode || ''}
        onInputChange={handleInputChange}
        autoComplete='postal-code'
        required
      />
      <InputGroup
        label={t('AddressForm.locality')}
        id='locality'
        name='locality'
        value={form.locality || ''}
        onInputChange={handleInputChange}
        autoComplete='address-level2'
        required
      />
      <InputGroup
        label={t('AddressForm.country')}
        id='country'
        name='country'
        value={form.country || ''}
        onInputChange={handleInputChange}
        autoComplete='country-name'
        required
      />
      <Flexbox justifyContent='flex-end'>
        <Button type='submit'>
          {submitButton?.title
            ? submitButton.title
            : selectedAddress
            ? t('commons.edit')
            : t('commons.create')}
        </Button>
        {onDeleteAddress ? (
          <DeleteConfirmation
            withLabel
            headerTitle={t('AddressForm.deleteAddress')}
            actions={actions.current}
          />
        ) : null}
        {onCancel ? (
          <CancelButton type='button' onClick={onCancel}>
            {cancelButton?.title ?? t('commons.cancel')}
          </CancelButton>
        ) : null}
      </Flexbox>
    </Form>
  );
};
