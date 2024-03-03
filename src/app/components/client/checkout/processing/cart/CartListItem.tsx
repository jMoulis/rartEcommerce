'use client';

import styled from '@emotion/styled';
import { ICartItem } from '@/src/types/DBTypes';
import { Selectbox } from '../../../../commons/form/Selectbox';
import { ChangeEvent } from 'react';
import { Flexbox } from '../../../../commons/Flexbox';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { IconButton } from '../../../../commons/Buttons/IconButton';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { SessionListItem } from '@/src/app/components/dashboard/workshops/Session/SessionListItem';
import { useQuantityOptions } from '../../../products/useQuantityOptions';

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

interface Props {
  item: ICartItem;
  editable: boolean;
}
export default function CartListItem({ item, editable }: Props) {
  const { onDeleteItemFromCart, onEditCart } = useCart();

  const quantityOptions = useQuantityOptions(item.stock ?? 0);

  const handleSelectQuantity = (event: ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.currentTarget;
    const updatedItem: ICartItem = {
      ...item,
      quantity: parseFloat(value),
    };
    onEditCart(updatedItem);
  };

  const handleDeleteItem = () => {
    onDeleteItemFromCart(item.id);
  };
  const handleDeleteSession = (sessionId: string) => {
    const updateItem: ICartItem = {
      ...item,
      sessions: item.sessions?.filter((prev) => prev._id !== sessionId),
    };
    if (updateItem.sessions?.length === 0) {
      onDeleteItemFromCart(updateItem.id);
    } else {
      onEditCart(updateItem);
    }
  };

  return (
    <ListItemCart>
      <Flexbox flexDirection='column'>
        <Flexbox flexDirection='column'>
          <h2>{item.name}</h2>
          <Description>{item.description}</Description>
          {item.type === 'workshop' ? (
            <ul>
              {item.sessions?.map((session, key) => (
                <SessionListItem
                  session={session}
                  onSelectSession={() => {}}
                  onDeleteSession={handleDeleteSession}
                  key={key}
                  showParticipant={false}
                  showAvaialable={false}
                />
              ))}
            </ul>
          ) : null}
        </Flexbox>
        {editable ? (
          <Flexbox alignItems='center'>
            {item.type !== 'workshop' ? (
              <Selectbox
                styling={{
                  root: {
                    marginBottom: 0,
                  },
                }}
                label=''
                id={`${item.id}-quantity`}
                name='quantity'
                onSelectOption={handleSelectQuantity}
                options={quantityOptions}
                value={String(item.quantity) ?? 0}
              />
            ) : null}
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
