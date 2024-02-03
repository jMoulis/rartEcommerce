import { ISession } from '@/src/types/DBTypes';
import React from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';

const Root = styled.li`
  padding: 10px;
  margin: 5px;
  border: 1px solid var(--input-border-color);
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--input-border-color);
  }
`;
const MetaWrapper = styled.div``;
const MetaLabel = styled.span``;
const MetaValue = styled.span``;

interface Props {
  session: ISession;
  onSelectSession: (session: ISession) => void;
}

export const SessionListItem = ({ session, onSelectSession }: Props) => {
  const t = useTranslations();
  return (
    <Root onClick={() => onSelectSession(session)}>
      <Flexbox>
        <MetaWrapper>
          <MetaLabel>{t('Session.start')}</MetaLabel>
          <MetaValue>{session.start}</MetaValue>
        </MetaWrapper>
        <MetaWrapper>
          <MetaLabel>{t('Session.end')}</MetaLabel>
          <MetaValue>{session.end}</MetaValue>
        </MetaWrapper>
      </Flexbox>
      {session.repetition ? (
        <MetaWrapper>
          <MetaLabel>{t('Session.repetition.label')}</MetaLabel>
          <Flexbox>
            <MetaLabel>{t('Session.repetition.frequencyLabel')}</MetaLabel>
            <MetaValue>
              {t('Session.repetition.frequency', {
                frequency: session.repetition?.frequency?.toLocaleLowerCase(),
              })}
            </MetaValue>
          </Flexbox>
          <Flexbox>
            <MetaLabel>{t('Session.repetition.days')}</MetaLabel>
            <MetaValue>
              {session.repetition?.days?.map((day, key) => (
                <span key={key}>
                  {t('Session.repetition.day', {
                    day,
                  })}
                </span>
              ))}
            </MetaValue>
          </Flexbox>
        </MetaWrapper>
      ) : null}
    </Root>
  );
};
