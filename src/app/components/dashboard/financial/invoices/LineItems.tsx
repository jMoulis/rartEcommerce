import { ILineItem } from '@/src/types/DBTypes';
import React, { Fragment } from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Button } from '../../../commons/Buttons/Button';
import { Input } from '../../../commons/form/Input';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto repeat(4, 150px);
`;
const Header = styled(Flexbox)`
  padding: 5px 10px;
  font-weight: bold;
  justify-content: center;
`;
const Cell = styled(Flexbox)`
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  padding: 5px;
`;
interface Props {
  items: ILineItem[];
  onDeleteItem?: (id: string) => void;
  onChangeQuantity?: (id: string, quantity: number) => void;
}

const LineItems = ({ items, onDeleteItem, onChangeQuantity }: Props) => {
  const t = useTranslations();
  return (
    <div>
      <Wrapper>
        <Header
          style={{
            justifyContent: 'flex-start'
          }}>
          {t('commons.description')}
        </Header>
        <Header>{t('commons.quantity')}</Header>
        <Header>{t('commons.unitPrice')}</Header>
        <Header>{t('commons.total')}</Header>
        <Header></Header>
        {items.map((item, key) => (
          <Fragment key={key}>
            <Cell>{item.description}</Cell>
            <Cell>
              <Input
                value={item.quantity}
                onChange={(e) => onChangeQuantity?.(item._id!, +e.target.value)}
                type='number'
                style={{
                  width: '100px'
                }}
              />
            </Cell>
            <Cell>{item.unitPrice}</Cell>
            <Cell>{item.total}</Cell>
            <Cell>
              <Button
                onClick={() => onDeleteItem?.(item._id!)}
                backgroundColor='var(--error-color)'>
                {t('commons.delete')}
              </Button>
            </Cell>
          </Fragment>
        ))}
      </Wrapper>
    </div>
  );
};

export default LineItems;
