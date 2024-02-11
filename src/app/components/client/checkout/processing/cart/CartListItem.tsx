'use client';

import styled from '@emotion/styled';
import { ICartItem } from '@/src/types/DBTypes';
import { Selectbox } from '../../../../commons/form/Selectbox';
import { ChangeEvent } from 'react';
import { Flexbox } from '../../../../commons/Flexbox';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { IconButton } from '../../../../commons/Buttons/IconButton';

const ListItemCart = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Price = styled.h3`
  white-space: nowrap;
`;

const Description = styled.p`
  max-width: 300px;
`;

const quantityOptions = [
  {
    label: '1',
    value: 1,
  },
  {
    label: '2',
    value: 2,
  },
];
interface Props {
  item: ICartItem;
  editable: boolean;
}
export default function CartListItem({ item, editable }: Props) {
  const handleSelectQuantity = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
  };
  const handleDeleteItem = () => {};

  return (
    <ListItemCart>
      <Flexbox flexDirection='column'>
        <Flexbox flexDirection='column'>
          <h2>{item.name}</h2>
          <Description>{item.description}</Description>
        </Flexbox>
        {editable ? (
          <Flexbox alignItems='center'>
            <Selectbox
              styling={{
                root: {
                  marginBottom: 0,
                },
              }}
              label=''
              id='quantity'
              name='quantity'
              onSelectOption={handleSelectQuantity}
              options={quantityOptions}
              value={String(item.quantity) ?? 0}
            />
            <IconButton
              style={{
                backgroundColor: 'var(--cancel-color)',
              }}
              icon={faTrash}
              onClick={handleDeleteItem}
            />
          </Flexbox>
        ) : (
          <span>{`x${item.quantity}`}</span>
        )}
      </Flexbox>
      <Price>
        {item.price} {item.currency.symbol}
      </Price>
    </ListItemCart>
  );
}
