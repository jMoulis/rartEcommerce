'use client';

import { IAddress } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import { AddressItem } from './AddressItem';
import { AddAddressForm } from './AddAddressForm';

interface Props {
  onAddAddress: (address: IAddress[]) => void;
  prevAddresses: IAddress[];
}

export const AddressForm = ({ prevAddresses }: Props) => {
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<IAddress | null>(null);

  useEffect(() => {
    setAddresses(prevAddresses);
  }, [prevAddresses]);

  const handleAddAddress = (newAddress: IAddress) => {
    setAddresses((prev) => [...prev, newAddress]);
  };
  const handleDeleteAddress = (addressId: string) => {
    setAddresses((prev) =>
      prev.filter((prevAddress) => prevAddress.id !== addressId)
    );
  };
  const handleSelectAddress = (addressId: string) => {
    const foundAddress = addresses.find((prev) => prev.id === addressId);
    setSelectedAddress(foundAddress ?? null);
  };
  return (
    <div>
      <ul>
        {addresses.map((address, key) => (
          <li key={key}>
            <AddressItem
              address={address}
              onDeleteAddress={handleDeleteAddress}
              onSelectAddress={handleSelectAddress}
            />
          </li>
        ))}
      </ul>
      <AddAddressForm
        onAddAddress={handleAddAddress}
        selectedAddress={selectedAddress}
      />
    </div>
  );
};
