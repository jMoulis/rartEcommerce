'use client';

import styled from '@emotion/styled';
import { ICartItem } from '@/src/types/DBTypes';
import { Selectbox } from '../../../commons/form/Selectbox';
import { ChangeEvent, useMemo } from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { IconButton } from '../../../commons/Buttons/IconButton';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { SessionListItem } from '@/src/app/components/dashboard/workshops/Session/SessionListItem';
import { useQuantityOptions } from '../../products/useQuantityOptions';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ImageWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100px;
`;
const ListItemCart = styled.li`
  display: grid;
  grid-template-columns: 100px 2fr 1fr;
  height: fit-content;
  margin: 20px;
  gap: 10px;
  @media (max-width: 768px) {
    margin: 0px;
    grid-template-columns: 100px 2fr;
    max-height: fit-content;
  }
`;
// const Price = styled.h3`
//   white-space: nowrap;
// `;
const Title = styled.h2`
  text-transform: uppercase;
  color: var(--primary-color);
  font-size: 24px;
  margin-bottom: 5px;
  @media (max-width: 768px) {
    font-size: 17px;
  }
`;
const Type = styled.h4`
  font-size: 12px;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.7);
  margin-bottom: 10px;
`;

const Description = styled.p`
  font-size: 14px;
  max-width: 80%;
  margin-bottom: 10px;
  @media (max-width: 768px) {
    display: none;
  }
`;

interface Props {
  item: ICartItem;
  editable: boolean;
}
export default function CartListItem({ item, editable }: Props) {
  const { onDeleteItemFromCart, onEditCart } = useCart();
  const t = useTranslations();

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

  const showDeleteButton = useMemo(() => {
    if (item.type === 'workshop') {
      return (item.sessions ?? [])?.length > 1;
    }
    return true;
  }, []);

  return (
    <ListItemCart>
      <ImageWrapper>
        <Image
          alt={item.name}
          src={item.imageUrl ?? ''}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          style={{
            objectFit: 'cover',
          }}
        />
      </ImageWrapper>
      <Flexbox flexDirection='column'>
        <Type>{t(`commons.${item.type}`)}</Type>
        <Title>{item.name}</Title>
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
                select: {
                  fontSize: '14px',
                  padding: '5px',
                },
              }}
              label=''
              id={`${item.id}-quantity`}
              name='quantity'
              onChangeSelectbox={handleSelectQuantity}
              options={quantityOptions}
              value={String(item.quantity) ?? 0}
            />
          ) : null}
          {showDeleteButton ? (
            <IconButton
              style={{
                backgroundColor: 'var(--cancel-color)',
              }}
              icon={faTrash}
              onClick={handleDeleteItem}
            />
          ) : null}
        </Flexbox>
      ) : (
        <span>{`x${item.quantity}`}</span>
      )}
    </ListItemCart>
  );
}
