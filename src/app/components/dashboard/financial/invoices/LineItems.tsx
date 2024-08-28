import { ILineItem } from '@/src/types/DBTypes';
import React, { Fragment } from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: auto repeat(3, 150px);
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
}

const LineItems = ({ items }: Props) => {
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
        {items.map((item, key) => (
          <Fragment key={key}>
            <Cell>{item.description}</Cell>
            <Cell>{item.quantity}</Cell>
            <Cell>{item.unitPrice}</Cell>
            <Cell>{item.total}</Cell>
          </Fragment>
        ))}
      </Wrapper>
    </div>
  );
};

export default LineItems;
