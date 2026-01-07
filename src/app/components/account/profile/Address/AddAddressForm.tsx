/* eslint-disable @typescript-eslint/naming-convention */
'use client';

import { IAddress } from '@/src/types/DBTypes';
import React, {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState
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
import { useTranslations } from 'next-intl';
import { APIProvider } from '@vis.gl/react-google-maps';
import PlaceAutocomplete from './Autocomplete copy';

function getAddressObject(
  address_components: google.maps.GeocoderAddressComponent[]
) {
  const ShouldBeComponent = {
    address: ['street_address', 'route'],
    streetNumber: ['street_number'],
    route: ['route'],
    locality: [
      'locality',
      'sublocality',
      'sublocality_level_1',
      'sublocality_level_2',
      'sublocality_level_3',
      'sublocality_level_4'
    ],
    country: ['country'],
    postalCode: ['postal_code'],
    countryCode: ['country']
  } as any;

  const address: IAddress = {
    name: '',
    type: 'shipping',
    address: '',
    streetNumber: '',
    route: '',
    locality: '',
    country: '',
    countryCode: '',
    postalCode: ''
  };
  address_components.forEach((component) => {
    for (const shouldBe in ShouldBeComponent) {
      if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
        if (shouldBe === 'countryCode') {
          (address as any)[shouldBe] = component.short_name;
        } else {
          (address as any)[shouldBe] = component.long_name;
        }
      }
    }
  });
  return address;
}

const Form = styled.form`
  background-color: #fff;
  border-radius: 8px;
  padding: 10px;
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
  type: 'shipping' as any
};

// const Autocomplete = dynamic(async () => import('./Autocomplete'), {
//   ssr: false
// });

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
  children
}: Props) => {
  const t = useTranslations();
  const actions = useRef([
    {
      label: deleteButton?.title ?? t('commons.delete'),
      callback: async () => {
        if (!selectedAddress?._id) return;
        onDeleteAddress?.(selectedAddress._id);
      }
    }
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
      [name]: value
    }));
  };
  const handleCheckDefault = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget;
    setForm((prev) => ({
      ...prev,
      default: checked
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

  const handleSelectAddress = (
    place: google.maps.places.PlaceResult | null
  ) => {
    if (!place) return;
    if (!place.geometry?.location) return;

    const address = getAddressObject(place.address_components ?? []);
    setForm((prev) => ({
      ...prev,
      ...address,
      lat: place.geometry?.location?.lat(),
      lng: place.geometry?.location?.lng()
    }));
    // setSelectedPlace({
    //   lat: place.geometry.location.lat(),
    //   lng: place.geometry.location.lng()
    // });

    // setAddress({
    //   uid: v4(),
    //   ...address,
    //   lat: place.geometry?.location?.lat(),
    //   lng: place.geometry?.location?.lng(),
    //   street: `${number?.long_name} ${street?.long_name}`,
    //   city: city?.long_name,
    //   zipCode: zipCode?.long_name,
    //   country: country?.long_name
    // });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {children}

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
          onChange={handleInputChange}
        />
      )}
      {noType ? null : (
        <Selectbox
          label={t('AddressForm.addressType')}
          id='type'
          name='type'
          value={form.type || ''}
          onChangeSelectbox={handleInputChange}
          options={[
            {
              label: t('AddressForm.type', { type: 'shipping' }),
              value: 'shipping'
            },
            {
              label: t('AddressForm.type', { type: 'billing' }),
              value: 'billing'
            }
          ]}
        />
      )}
      <APIProvider apiKey='AIzaSyA2RjeKneC6aHDkx2t3Rf_16rEbzyb2LVw'>
        <PlaceAutocomplete
          // placeholder={`${t('AddressForm.autofillAddress')}`}
          // value={form.address ?? ''}
          // onChange={handleInputChange}
          onPlaceSelect={handleSelectAddress}
          // required
          // name='address'
          // id='address'
          // labelTip={`(${t('AddressForm.streetNumberStreet')})`}
          // label={t('AddressForm.address')}
        />
      </APIProvider>
      <InputGroup
        label={t('AddressForm.address')}
        id='address'
        name='address'
        value={form.address ?? ''}
        onChange={handleInputChange}
        placeholder={t('AddressForm.streetNumberStreet')}
      />
      <InputGroup
        label={t('AddressForm.additional')}
        id='additional'
        name='additional'
        value={form.additional ?? ''}
        onChange={handleInputChange}
        placeholder={t('AddressForm.additionalPlaceholder')}
      />
      <InputGroup
        styling={{
          root: {
            visibility: 'hidden',
            margin: 0,
            height: 0
          }
        }}
        type='hidden'
        label={t('AddressForm.streetNumber')}
        id='streetNumber'
        name='streetNumber'
        value={form.streetNumber || ''}
        onChange={handleInputChange}
        autoComplete='address-number'
        required
      />
      <InputGroup
        label={t('AddressForm.postalCode')}
        id='postalCode'
        name='postalCode'
        value={form.postalCode || ''}
        onChange={handleInputChange}
        autoComplete='postal-code'
        required
      />
      <InputGroup
        label={t('AddressForm.locality')}
        id='locality'
        name='locality'
        value={form.locality || ''}
        onChange={handleInputChange}
        autoComplete='address-level2'
        required
      />
      <InputGroup
        label={t('AddressForm.country')}
        id='country'
        name='country'
        value={form.country || ''}
        onChange={handleInputChange}
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
