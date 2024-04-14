import { IAddress, ISession, IWorkshop } from '@/src/types/DBTypes';
import React, { useEffect, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';
import { Unsubscribe } from 'firebase/firestore';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onFindSingleRealtime } from '@/src/app/contexts/firestore/useFirestore';
import { format, addMilliseconds } from 'date-fns';
import { AddToCart } from '../../checkout/cart/AddToCart';
import { Button } from '../../../commons/Buttons/Button';
import { toast } from 'react-toastify';
import { useCart } from '@/src/app/contexts/cart/CartContext';
import { fr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChair,
  faClock,
  faLocationDot,
} from '@fortawesome/pro-light-svg-icons';

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
const ButtonWrapper = styled.div`
  margin: 10px;
  & button {
    width: 100%;
    margin: 5px 0;
  }
  @media (max-width: 768px) {
    display: flex;
    flex: 1;
    margin-top: 10px;
    margin-bottom: 0;
    justify-content: center;
    & button {
      margin-right: 10px;
    }
  }
`;

const MetaWrapper = styled.div`
  display: flex;
  margin-right: 10px;
`;
const MetaLabel = styled.span`
  white-space: nowrap;
`;
const MetaValue = styled.span`
  white-space: nowrap;
`;

interface Props {
  session: ISession;
  workshop: IWorkshop;
  preview: boolean;
  // onSelectSession: (session: ISession) => void;
}

export const SessionListItem = ({ session, workshop, preview }: Props) => {
  const t = useTranslations();
  const [location, setLocation] = useState<IAddress | null>(null);
  const { cart, onEditCart } = useCart();

  useEffect(() => {
    if (!session) return;
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

  const prepareCardDate = useMemo(() => {
    const dayNumber = format(session.start, 'dd', { locale: fr });
    const month = format(session.start, 'MMMM', { locale: fr });
    const day = format(session.start, 'EEEE', { locale: fr });
    const duration = session.duration ?? 0;
    const endDate = addMilliseconds(new Date(session.start), duration);
    const startTime = format(session.start, 'HH:mm');
    const endTime = format(endDate, 'HH:mm');

    return {
      dayNumber,
      month,
      day,
      endTime,
      startTime,
    };
  }, [session.start]);
  return (
    <Root>
      <Flexbox justifyContent='space-between' flexWrap='wrap'>
        <Flexbox alignItems='center'>
          <MetaWrapper>
            <Flexbox>
              <MetaValue
                style={{
                  fontSize: '50px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {prepareCardDate?.dayNumber}
              </MetaValue>
              <Flexbox
                flexDirection='column'
                justifyContent='center'
                style={{
                  marginLeft: '10px',
                }}>
                <MetaValue
                  style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    textTransform: 'capitalize',
                  }}>
                  {prepareCardDate?.month}
                </MetaValue>
                <MetaValue
                  style={{
                    color: 'rgba(0,0,0,0.5)',
                    textTransform: 'capitalize',
                    fontSize: '20px',
                  }}>
                  {prepareCardDate?.day}
                </MetaValue>
              </Flexbox>
            </Flexbox>
          </MetaWrapper>
          <Flexbox flexDirection='column'>
            <MetaWrapper
              style={{
                marginBottom: '5px',
              }}>
              <MetaLabel
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                }}>
                <FontAwesomeIcon icon={faClock} />
              </MetaLabel>
              <MetaLabel>{prepareCardDate?.startTime}</MetaLabel>
              <MetaLabel>-</MetaLabel>
              <MetaLabel>{prepareCardDate?.endTime}</MetaLabel>
            </MetaWrapper>
            <MetaWrapper
              style={{
                marginBottom: '5px',
              }}>
              <MetaLabel
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                }}>
                <FontAwesomeIcon icon={faLocationDot} />
              </MetaLabel>
              <MetaValue>{location?.name}</MetaValue>
            </MetaWrapper>
            <MetaWrapper>
              <MetaLabel
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '20px',
                }}>
                <FontAwesomeIcon icon={faChair} />
              </MetaLabel>
              <MetaLabel>{t('Session.places')}</MetaLabel>
              <MetaValue
                style={{
                  marginLeft: '5px',
                }}>
                {placeleft}
              </MetaValue>
            </MetaWrapper>
          </Flexbox>
        </Flexbox>
        {selectedCartSessionIds.includes(session._id) ? (
          <ButtonWrapper>
            <Button
              onClick={() => !preview && handleDeleteSession(session._id)}
              backgroundColor='rgba(255,0,0,0.4)'>
              {t('Booking.unSubscribe')}
            </Button>
          </ButtonWrapper>
        ) : (
          <ButtonWrapper>
            {placeleft ? (
              <AddToCart
                withPreviewCart={false}
                items={[workshopSessioned]}
                label={t('Booking.register')}
              />
            ) : (
              <Button backgroundColor='rgba(0,0,255,0.4)'>
                {t('Booking.keepMeInform')}
              </Button>
            )}
            <Flexbox>
              <Button
                backgroundColor='var(--secondary-color)'
                hoverBackgroundColor='var(--secondary-accent)'>
                {t('commons.share')}
              </Button>
            </Flexbox>
          </ButtonWrapper>
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
