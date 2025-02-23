'use client';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { AddressAutofill, config } from '@mapbox/search-js-react';
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
  placeholder
}: Props) => {
  const tokenRef = useRef<string>(`${process.env.NEXT_PUBLIC_MAPBOX}`);

  useEffect(() => {
    config.accessToken = tokenRef.current;
  }, []);

  return (
    <AddressAutofillUntyped
      onRetrieve={onSelectAddress}
      accessToken={tokenRef.current ?? `${process.env.NEXT_PUBLIC_MAPBOX}`}>
      <InputGroup
        id={id}
        name={name}
        label={label}
        placeholder={placeholder}
        type='text'
        autoComplete='address-line1'
        value={value}
        required={required}
        onChange={onChange}
        labelTip={labelTip}
      />
    </AddressAutofillUntyped>
  );
};

export default Autocomplete;
