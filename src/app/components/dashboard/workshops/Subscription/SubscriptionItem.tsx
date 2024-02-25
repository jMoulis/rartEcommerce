import React from 'react';
import styled from '@emotion/styled';
import { ISubscription } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';
import { Button } from '../../../commons/Buttons/Button';

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  border: 1px solid var(--input-border-color);
  border-radius: 6px;
`;

interface Props {
  onOpen: VoidFunction;
  subscription?: ISubscription;
}

export const SubscriptionItem = ({ onOpen, subscription }: Props) => {
  const t = useTranslations();
  return (
    <Root>
      <Flexbox alignItems='center'>
        <span
          style={{
            marginLeft: '10px',
          }}>
          {subscription?.name}
        </span>
      </Flexbox>
      <Button onClick={onOpen}>{t('commons.edit')}</Button>
    </Root>
  );
};
