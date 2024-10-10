'use client';

import { IAddress } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import React from 'react';
import { Button } from '../../../commons/Buttons/Button';
import styled from '@emotion/styled';
import { Flexbox } from '../../../commons/Flexbox';

const Root = styled.div`
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5px;
  margin: 10px;
`;

const Address = styled.address`
  margin-bottom: 10px;
`;
const Item = styled.div`
  display: flex;
  margin: 5px 0;
`;
const Label = styled.span`
  font-weight: bolder;
  margin-right: 5px;
`;
const Value = styled.span`
  margin-right: 5px;
`;

interface Props {
  address: IAddress;
  onSelectAddress: (addressId?: string) => void;
}

export const AddressItem = ({ address, onSelectAddress }: Props) => {
  const tAddress = useTranslations('AddressForm');
  const tCommons = useTranslations('commons');
  return (
    <Root>
      <Address>
        <Item>
          <Label>{tAddress('default')}</Label>
          <Value
            style={{
              width: '15px',
              height: '15px',
              borderRadius: '3px',
              backgroundColor: address.default
                ? 'var(--primary-color)'
                : 'transparent',
            }}>
            {address.default}
          </Value>
        </Item>
        <Item>
          <Label>{tAddress('name')}</Label>
          <Value>{address.name}</Value>
        </Item>
        <Item>
          <Label>{tAddress('addressType')}</Label>
          <Value>
            {tAddress('type', {
              type: address.type,
            })}
          </Value>
        </Item>
        <Item
          style={{
            flexDirection: 'column',
          }}>
          <Label>{tAddress('route')}</Label>
          <Flexbox>
            <Value>{address.streetNumber}</Value>
            <Value>{address.route}</Value>
          </Flexbox>
          <Flexbox>
            <Value>{address.postalCode}</Value>
            <Value>{address.locality}</Value>
            <Value>{address.country}</Value>
          </Flexbox>
        </Item>
      </Address>
      <Button
        type='button'
        style={{ marginLeft: 0 }}
        onClick={() => onSelectAddress(address._id)}>
        {tCommons('edit')}
      </Button>
    </Root>
  );
};
