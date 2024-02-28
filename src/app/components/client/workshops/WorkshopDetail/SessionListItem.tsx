import { IAddress, ISession, IWorkshop } from '@/src/types/DBTypes';
import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';
import { Unsubscribe } from 'firebase/firestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onFindSingleRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { format } from 'date-fns';
import { millisecondsToMins } from '../../../dashboard/workshops/Session/durations';
import { AddToCart } from '../../checkout/processing/cart/AddToCart';
import { Button } from '../../../commons/Buttons/Button';
import { toast } from 'react-toastify';
import { useCart } from '@/src/app/contexts/cart/CartContext';

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
const MetaLabel = styled.span``;
const MetaValue = styled.span``;

interface Props {
  session: ISession;
  workshop: IWorkshop;
  // onSelectSession: (session: ISession) => void;
}

export const SessionListItem = ({ session, workshop }: Props) => {
  const t = useTranslations();
  const [location, setLocation] = useState<IAddress | null>(null);
  const { cart, onEditCart } = useCart();

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

  const placeleft = useMemo(() => {
    if (session.maxParticipants - session.participants?.length <= 0) return 0;
    return session.maxParticipants - session.participants?.length;
  }, [session.maxParticipants, session.participants]);

  const workshopSessioned: IWorkshop = useMemo(() => {
    return {
      ...workshop,
      sessions: workshop.sessions.filter(
        (prevSession) => prevSession._id === session._id
      ),
    };
  }, []);

  const selectedCartSessionIds = useMemo(() => {
    if (!cart?.items) return [];

    const sessionIds = cart.items.reduce((acc: string[], item) => {
      if (!item.sessions) return acc;
      return [...acc, ...item.sessions.map((session) => session._id)];
    }, []);
    return sessionIds;
  }, [cart]);

  const handleDeleteSession = (sessionId: string) => {
    const prevItem = cart?.items.find(
      (prev) => prev.productId === workshop._id
    );

    if (!prevItem) return;
    const updatedItem = {
      ...prevItem,
      sessions: prevItem.sessions?.filter((prev) => prev._id !== sessionId),
    };
    onEditCart(updatedItem);
  };

  const getFormatedDate = useMemo(() => {
    try {
      const startDate = format(session.start, 'dd/mm/yyyy');
      const startTime = format(session.start, 'hh:mm');
      return {
        startDate,
        startTime,
      };
    } catch (error) {
      return null;
    }
  }, [session.start]);

  return (
    <Root>
      <Flexbox>
        <MetaWrapper>
          <MetaLabel>{t('Session.start')}</MetaLabel>
          <MetaValue>{getFormatedDate?.startDate}</MetaValue>
          <MetaValue>{getFormatedDate?.startTime}</MetaValue>
          {session.duration ? (
            <MetaValue>{`${millisecondsToMins(
              session.duration
            )} mins`}</MetaValue>
          ) : null}
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
        <MetaWrapper>
          <MetaLabel>{t('Session.places')}</MetaLabel>
          <MetaValue>{placeleft}</MetaValue>
        </MetaWrapper>
        {selectedCartSessionIds.includes(session._id) ? (
          <MetaWrapper>
            <Button
              onClick={() => handleDeleteSession(session._id)}
              style={{
                background: 'rgba(255,0,0,0.4)',
              }}>
              {t('Booking.unSubscribe')}
            </Button>
          </MetaWrapper>
        ) : (
          <MetaWrapper>
            {placeleft ? (
              <AddToCart
                item={workshopSessioned}
                label={t('Booking.register')}
              />
            ) : (
              <Button
                style={{
                  background: 'rgba(0,0,255,0.4)',
                }}>
                {t('Booking.keepMeInform')}
              </Button>
            )}
            <Button
              style={{
                background: 'rgba(0,0,255,0.4)',
              }}>
              {t('commons.share')}
            </Button>
          </MetaWrapper>
        )}
      </Flexbox>

      {/* {session.repetition ? (
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
      ) : null} */}
    </Root>
  );
};
