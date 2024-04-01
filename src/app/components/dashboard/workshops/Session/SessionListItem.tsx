import { IAddress, ISession } from '@/src/types/DBTypes';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';
import { Unsubscribe } from 'firebase/firestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onFindSingleRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { format } from 'date-fns';
import { IconButton } from '../../../commons/Buttons/IconButton';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { toast } from 'react-toastify';
import { useToggle } from '../../../hooks/useToggle';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import Participants from './Participants';
import { fr } from 'date-fns/locale';

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
const MetaWrapper = styled.div`
  margin-right: 10px;
`;
const MetaLabel = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;
const MetaValue = styled.span``;

interface Props {
  session: ISession;
  onSelectSession: (session: ISession) => void;
  onDeleteSession?: (sessionId: string) => void;
  showParticipant: boolean;
  showAvaialable: boolean;
}

export const SessionListItem = ({
  session,
  onSelectSession,
  onDeleteSession,
  showParticipant,
  showAvaialable,
}: Props) => {
  const [location, setLocation] = useState<IAddress | null>(null);
  const { open, onOpen, onClose } = useToggle();

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null;
    if (session?.locationId) {
      unsubscribe = onFindSingleRealtime(
        ENUM_COLLECTIONS.LOCATIONS,
        session?.locationId,
        (data) => {
          setLocation(data);
        },
        (error) => {
          toast.error(error.message);
        }
      );
    }

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [session?.locationId]);
  const t = useTranslations();
  return (
    <>
      <Root onClick={() => onSelectSession(session)}>
        <Flexbox>
          <MetaWrapper>
            <MetaLabel>{t('Session.start')}</MetaLabel>
            <Flexbox>
              <MetaValue
                style={{
                  marginRight: '5px',
                }}>
                {format(session.start, 'dd/mm/yyyy', { locale: fr })}
              </MetaValue>
              <MetaValue>{format(session.start, 'HH:mm')}</MetaValue>
            </Flexbox>
          </MetaWrapper>
          {session.end ? (
            <MetaWrapper>
              <MetaLabel>{t('Session.end')}</MetaLabel>
              <MetaValue>{session.end}</MetaValue>
            </MetaWrapper>
          ) : null}
          <MetaWrapper>
            <MetaLabel>{t('Booking.location')}</MetaLabel>
            <MetaValue>{location?.name}</MetaValue>
          </MetaWrapper>
          {showAvaialable ? (
            <MetaWrapper>
              <MetaLabel>{t('Session.places')}</MetaLabel>
              <MetaValue>{session?.maxParticipants}</MetaValue>
            </MetaWrapper>
          ) : null}
          {showParticipant ? (
            <MetaWrapper>
              <MetaLabel>{t('Session.participants')}</MetaLabel>
              <Flexbox>
                <MetaValue>{session?.participants?.length}</MetaValue>
                <MetaValue
                  style={{
                    textDecoration: 'underline',
                  }}
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpen();
                  }}>
                  {t('commons.seeMore')}
                </MetaValue>
              </Flexbox>
            </MetaWrapper>
          ) : null}
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
        {onDeleteSession ? (
          <IconButton
            onClick={() => onDeleteSession(session._id)}
            icon={faTrash}
          />
        ) : null}
      </Root>
      <FullDialog
        dialog={{
          fullWidth: true,
          maxWidth: 'sm',
        }}
        header={{
          title: t('Session.participants'),
        }}
        open={open}
        onClose={onClose}>
        <Participants participants={session.participants} />
      </FullDialog>
    </>
  );
};
