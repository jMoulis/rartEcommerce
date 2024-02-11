'use client';

import React, { ChangeEvent } from 'react';
import { AddressAutofill } from '@mapbox/search-js-react';
import { InputGroup } from '../../../commons/form/InputGroup';

interface Props {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onSelectAddress: (res: any) => void;
  required?: boolean;
  id: string;
  name: string;
  label?: string;
  labelTip?: string;
  placeholder?: string;
  token?: string;
}

const AddressAutofillUntyped: any = AddressAutofill;

const Autocomplete = ({
  value,
  onChange,
  onSelectAddress,
  required,
  id,
  name,
  label,
  labelTip,
  placeholder,
  token,
}: Props) => {
  return (
    <>
      <AddressAutofillUntyped
        onRetrieve={onSelectAddress}
        accessToken={token ?? `${process.env.NEXT_PUBLIC_MAPBOX}`}>
        <InputGroup
          id={id}
          name={name}
          label={label}
          placeholder={placeholder}
          type='text'
          autoComplete='address-line1'
          value={value}
          required={required}
          onInputChange={onChange}
          labelTip={labelTip}
        />
      </AddressAutofillUntyped>
    </>
  );
};

export default Autocomplete;
