import React, { ChangeEvent, useMemo } from 'react';
import { IRepetition, ISession } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { InputGroup } from '../../../commons/form/InputGroup';
import { Flexbox } from '../../../commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarClock, faClock } from '@fortawesome/pro-light-svg-icons';
import { Selectbox } from '../../../commons/form/Selectbox';
import { RepetitionForm } from './Repetition/RepetitionForm';
import { getDurations } from './durations';
import styled from '@emotion/styled';
import { Locations } from '../Locations/Locations';

const InputWrapper = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  margin-bottom: 10px;
`;

const RepetitionWrapper = styled.div`
  background-color: var(--list-item-color);
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
`;

interface Props {
  selectedSession: ISession;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSession: (session: ISession) => void;
}

export const SessionForm = ({
  selectedSession,
  onDeleteSession,
  onUpdateSession
}: // onDirectMutation,
Props) => {
  const t = useTranslations();

  const handleSelectLocation = (locationId: string) => {
    const updatedSession = {
      ...selectedSession,
      locationId
    };
    onUpdateSession(updatedSession);
  };

  const handleRemoveLocation = () => {
    const updatedSession = {
      ...selectedSession,
      locationId: null
    };
    onUpdateSession(updatedSession);
  };

  const handleDeleteRepetition = () => {
    const updatedSession = {
      ...selectedSession,
      repetition: null
    };
    onUpdateSession(updatedSession);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.currentTarget;

    const parsedValue = type === 'number' ? parseFloat(value) : value;
    const updatedSession = {
      ...selectedSession,
      [name]: parsedValue
    };
    onUpdateSession(updatedSession);
  };
  const handleSelectDuration = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.currentTarget;
    const updatedSession = {
      ...selectedSession,
      [name]: parseFloat(value)
    };
    onUpdateSession(updatedSession);
  };

  const handleUpdateRepetition = (repetition: IRepetition) => {
    onUpdateSession({
      ...selectedSession,
      repetition
    });
  };

  const durations = useMemo(() => getDurations(t), []);

  if (!selectedSession) return null;

  return (
    <>
      <Flexbox
        style={{
          backgroundColor: '#fff',
          padding: '10px',
          flex: '1',
          borderRadius: '8px',
          flexDirection: 'column'
        }}>
        <InputWrapper>
          <Flexbox alignItems='center'>
            <FontAwesomeIcon icon={faCalendarClock as any} />
            <p
              style={{
                marginLeft: '10px'
              }}>
              {t('Session.start')}
            </p>
          </Flexbox>
          <InputGroup
            type='datetime-local'
            id='start'
            name='start'
            value={selectedSession?.start ?? ''}
            styling={{
              root: {
                marginBottom: '0'
              }
            }}
            onInputChange={handleInputChange}
          />
        </InputWrapper>
        <InputWrapper>
          <Flexbox alignItems='center'>
            <FontAwesomeIcon icon={faCalendarClock as any} />
            <p
              style={{
                marginLeft: '10px'
              }}>
              {t('Session.places')}
            </p>
          </Flexbox>
          <InputGroup
            onInputChange={handleInputChange}
            type='number'
            name='maxParticipants'
            id='maxParticipants'
            value={selectedSession?.maxParticipants ?? ''}
            styling={{
              root: {
                marginBottom: '0'
              }
            }}
          />
        </InputWrapper>

        <InputWrapper>
          <Flexbox alignItems='center'>
            <FontAwesomeIcon icon={faClock as any} />
            <p
              style={{
                marginLeft: '10px'
              }}>
              {t('Session.duration')}
            </p>
          </Flexbox>
          <Selectbox
            id='duration'
            name='duration'
            styling={{
              root: {
                margin: 0
              }
            }}
            value={`${selectedSession?.duration}` || ''}
            onChangeSelectbox={handleSelectDuration}
            options={durations}
          />
        </InputWrapper>
        <Locations
          locationId={selectedSession.locationId}
          onSelectLocation={handleSelectLocation}
          onDeleteLocation={handleRemoveLocation}
        />
        <RepetitionWrapper>
          <RepetitionForm
            repetition={selectedSession.repetition ?? null}
            onChange={handleUpdateRepetition}
            onDelete={handleDeleteRepetition}
            selectedSession={selectedSession}
          />
        </RepetitionWrapper>
      </Flexbox>
    </>
  );
};
