import React, { ChangeEvent, useState } from 'react';
import { Article } from '../../products/CreateForm/Article';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useToggle } from '../../../hooks/useToggle';
import { useForm } from '../../../hooks/useForm';
import { IOccurence, ISession } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { InputGroup } from '../../../commons/form/InputGroup';
import { Button } from '../../../commons/Buttons/Button';
import { Flexbox } from '../../../commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarCheck,
  faCalendarClock,
  faClock,
} from '@fortawesome/pro-light-svg-icons';
import { Selectbox } from '../../../commons/form/Selectbox';
import { RepetitionForm } from './RepetitionForm';
import { RecurrenceRule } from './RecurrenceRule';
import { generateDefaultSession } from '../../products/CreateForm/defaultData';
import { APIResponse } from '@/src/types/types';
import { Occurences } from './Occurences';
import { SessionList } from './SessionList';
import { SubmitButton } from '../../products/CreateForm/SubmitButton';

const minuteToMillisecondes = (minutes: number) => {
  const secondsPerMinute = 60;
  const millisecondsPerSecond = 1000;
  return minutes * secondsPerMinute * millisecondsPerSecond;
};

const hourToMillisecondes = (hours: number) => {
  const minutePerHour = 60;
  const secondsPerMinute = 60;
  const millisecondsPerSecond = 1000;
  return hours * minutePerHour * secondsPerMinute * millisecondsPerSecond;
};

interface Props {
  onNewSession: (session: ISession) => void;
  sessions: ISession[];
}

export const SessionForm = ({ onNewSession, sessions }: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const { onInputChange, onDirectMutation, form, onInitForm } =
    useForm<ISession>();
  const t = useTranslations();
  const [loading, setLoading] = useState(false);
  const [occurences, setOccurences] = useState<IOccurence[]>([]);

  const handleUpdateRepetition = (rule: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      rule,
    }));
  };

  const handleSubmit = () => {
    const recurrence = new RecurrenceRule({
      freq: form.repetition?.frequency,
      interval: form.repetition?.interval ?? 1,
      end: form.repetition?.end ? new Date(form.repetition?.end) : undefined,
      dtstart: form.start ? new Date(form.start) : undefined,
      byweekday: form.repetition?.days ?? [],
    });
    const repetitionRule = recurrence.toString();
    onNewSession({
      ...form,
      repetition: form?.repetition?._id
        ? {
            ...form?.repetition,
            rule: repetitionRule,
          }
        : undefined,
    });
    onClose();
  };

  const handleSelectedDateInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;

    onDirectMutation((prev) => ({
      ...prev,
      [name]: value,
      repetition: {
        ...prev.repetition,
        [name]: value,
      },
    }));
  };
  const handleGenerate = async () => {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    };
    try {
      setLoading(true);
      const response = await fetch('/api/session', payload);
      const resBody = (await response.json()) as unknown as APIResponse<
        IOccurence[]
      >;
      setOccurences(resBody.data ?? []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  const handleSaveOccurences = (occurencesJsonUrl: string) => {
    onDirectMutation((prev) => ({
      ...prev,
      repetition: {
        ...prev.repetition,
        occurencesJsonUrl,
      },
    }));
  };
  const handleCreateSession = () => {
    const defaultSession = generateDefaultSession();
    onInitForm(defaultSession);
    onOpen();
  };

  const handleSelectionSession = (selectedSession: ISession) => {
    onInitForm(selectedSession);
    onOpen();
  };
  return (
    <>
      <Article headerTitle='Sessions'>
        <Button onClick={handleCreateSession}>
          {t('Session.createSession')}
        </Button>
        <SessionList
          sessions={sessions || []}
          onSelectSession={handleSelectionSession}
        />
      </Article>
      <FullDialog
        open={open}
        onClose={onClose}
        header={{
          title: t('Session.editSession'),
        }}
        dialog={{
          keepMounted: false,
          fullWidth: true,
          maxWidth: 'sm',
        }}>
        <Flexbox
          style={{
            backgroundColor: '#fff',
            padding: '10px',
            flex: '1',
            borderRadius: '8px',
            flexDirection: 'column',
          }}>
          <Flexbox alignItems='center'>
            <Flexbox alignItems='center'>
              <FontAwesomeIcon icon={faCalendarClock} />
              <p
                style={{
                  marginLeft: '10px',
                }}>
                {t('Session.start')}
              </p>
            </Flexbox>
            <InputGroup
              type='datetime-local'
              id='start'
              name='start'
              value={form.start || ''}
              styling={{
                root: {
                  marginBottom: '0',
                  marginRight: '10px',
                  marginLeft: '10px',
                },
                input: {
                  height: '38px',
                },
              }}
              onInputChange={handleSelectedDateInput}
            />
          </Flexbox>
          <Flexbox alignItems='center'>
            <Flexbox alignItems='center'>
              <FontAwesomeIcon icon={faClock} />
              <p
                style={{
                  marginLeft: '10px',
                }}>
                {t('Session.duration')}
              </p>
            </Flexbox>
            <Selectbox
              id='duration'
              name='duration'
              styling={{
                root: {
                  margin: 0,
                },
              }}
              value={`${form.duration}` || ''}
              onSelectOption={onInputChange}
              options={[
                {
                  label: t('commons.select'),
                  value: '',
                },
                {
                  label: '15 min',
                  value: minuteToMillisecondes(15),
                },
                {
                  label: '30 min',
                  value: minuteToMillisecondes(30),
                },
                {
                  label: '45 min',
                  value: minuteToMillisecondes(45),
                },
                {
                  label: '1 h',
                  value: hourToMillisecondes(1),
                },
                {
                  label: '1h 30',
                  value: hourToMillisecondes(1.5),
                },
                {
                  label: '2 h',
                  value: hourToMillisecondes(2),
                },
              ]}
            />
          </Flexbox>
          <RepetitionForm
            repetition={form.repetition}
            location={form.location}
            startDate={form.start}
            until={form.end}
            onSubmit={handleUpdateRepetition}
            onChange={onDirectMutation}
          />
          <Flexbox>
            <Flexbox alignItems='center'>
              <FontAwesomeIcon icon={faCalendarCheck} />
              <p
                style={{
                  marginLeft: '10px',
                }}>
                {t('Session.until')}
              </p>
            </Flexbox>
            <InputGroup
              type='date'
              id='end'
              name='end'
              value={form.end ?? ''}
              styling={{
                root: {
                  marginBottom: '0',
                  marginRight: '10px',
                  marginLeft: '10px',
                },
                input: {
                  height: '38px',
                },
              }}
              onInputChange={handleSelectedDateInput}
            />
          </Flexbox>
          <Flexbox
            style={{
              marginTop: '10px',
            }}>
            <Button type='button' onClick={handleGenerate}>
              <span> {t('Session.generate')}</span>
              {loading ? <span>Loading</span> : null}
            </Button>
            {occurences?.length ? (
              <Occurences
                occurences={occurences}
                sessionId={form._id}
                onSaveOccurences={handleSaveOccurences}
              />
            ) : null}
          </Flexbox>
        </Flexbox>
        <Flexbox
          style={{
            marginTop: '20px',
            justifyContent: 'flex-end',
          }}>
          <SubmitButton onClick={handleSubmit} />
        </Flexbox>
      </FullDialog>
    </>
  );
};
