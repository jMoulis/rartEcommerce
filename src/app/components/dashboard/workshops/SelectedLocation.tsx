import React from 'react';
import styled from '@emotion/styled';
import { IAddress } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/pro-light-svg-icons';
import { Flexbox } from '../../commons/Flexbox';
import { Button } from '../../commons/Buttons/Button';

const Root = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 10px;
  border: 1px solid var(--input-border-color);
  border-radius: 6px;
`;

interface Props {
  location?: IAddress;
  onOpen: VoidFunction;
}

export const SelectedLocation = ({ location, onOpen }: Props) => {
  const t = useTranslations();
  return (
    <Root>
      <Flexbox alignItems='center'>
        <FontAwesomeIcon icon={faLocationDot as any} />
        <span
          style={{
            marginLeft: '10px'
          }}>
          {location?.name}
        </span>
      </Flexbox>
      <Button onClick={onOpen}>{t('commons.edit')}</Button>
    </Root>
  );
};
