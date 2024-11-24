import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Selectbox } from '../../../../commons/form/Selectbox';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../../commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faSpinner } from '@fortawesome/pro-light-svg-icons';
import { IOccurence, IRepetition, ISession } from '@/src/types/DBTypes';
import { ByWeekday, Frequency } from '../types';
import { generateDefaultRepetition } from '../../../products/CreateForm/defaultData';
import { Button } from '../../../../commons/Buttons/Button';
import { InputGroup } from '../../../../commons/form/InputGroup';
import { Occurrences } from '../Occurrences';
import { APIResponse } from '@/src/types/types';
import { RepetitionHeader } from './RepetitionHeader';
import { toast } from 'react-toastify';

const days: Array<{
  label: string;
  value: ByWeekday;
}> = [
  {
    label: 'L',
    value: 'MO'
  },
  {
    label: 'M',
    value: 'TU'
  },
  {
    label: 'M',
    value: 'WE'
  },
  {
    label: 'J',
    value: 'TH'
  },
  {
    label: 'V',
    value: 'FR'
  },
  {
    label: 'S',
    value: 'SA'
  },
  {
    label: 'D',
    value: 'SU'
  }
];

const Root = styled(Flexbox)`
  flex-direction: column;
`;

const DayTag = styled.button<{ selected: boolean }>`
  border: 1px solid var(--input-border-color);
  height: 30px;
  width: 30px;
  border-radius: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px;
  background-color: ${({ selected }) =>
    selected ? 'var(--primary-color)' : '#fff'};

  color: ${({ selected }) => (selected ? '#fff' : '')};
`;

interface Props {
  repetition: IRepetition | null;
  onChange: (repetition: IRepetition) => void;
  onDelete: (repetitionId: string) => void;
  selectedSession: ISession;
}

export const RepetitionForm = ({
  repetition,
  selectedSession,
  onChange,
  onDelete
}: Props) => {
  const t = useTranslations();
  const [loading, setLoading] = useState(false);

  const [occurrences, setOccurrences] = useState<IOccurence[]>([]);

  const fetchOccurrences = async (url: string) => {
    try {
      const data = await (await fetch(url)).json();
      setOccurrences(data);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (repetition?.occurrencesJsonUrl) {
      fetchOccurrences(repetition?.occurrencesJsonUrl);
    }
  }, [repetition]);

  const handleAddRepetion = () => {
    const defaultRepetition = generateDefaultRepetition();
    onChange(defaultRepetition);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = event.currentTarget;
    onChange({
      ...repetition,
      [name]: value as any
    });
  };

  const handleSelectDay = (dayValue: ByWeekday) => {
    const prevDays = repetition?.days ?? [];
    const prevIndex = prevDays.indexOf(dayValue);
    let updatedDays = [...prevDays];

    if (prevIndex < 0) {
      updatedDays = [...updatedDays, dayValue];
    } else {
      updatedDays = [...prevDays.filter((prevDay) => prevDay !== dayValue)];
    }
    const updatedRepetition = {
      ...repetition,
      days: updatedDays
    };
    onChange(updatedRepetition);
  };

  const handleGenerate = async () => {
    const payload = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedSession)
    };
    try {
      setLoading(true);
      const response = await fetch('/api/session', payload);
      const resBody = (await response.json()) as unknown as APIResponse<
        IOccurence[]
      >;
      setOccurrences(resBody.data ?? []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSaveOccurrences = (occurrencesJsonUrl: string) => {
    onChange({
      ...repetition,
      occurrencesJsonUrl
    });
  };
  return (
    <Root>
      {repetition?._id ? (
        <Flexbox flexDirection='column'>
          <RepetitionHeader onDelete={onDelete} repetition={repetition} />
          <Flexbox flexDirection='column'>
            <Selectbox
              id='frequency'
              name='frequency'
              value={repetition.frequency}
              onChangeSelectbox={handleInputChange}
              styling={{
                root: {
                  margin: 0
                }
              }}
              options={[
                {
                  label: t('commons.select'),
                  value: ''
                },
                {
                  label: t('Session.repetition.frequency', {
                    frequency: 'daily'
                  }),
                  value: Frequency.DAILY
                },
                {
                  label: t('Session.repetition.frequency', {
                    frequency: 'weekly'
                  }),
                  value: Frequency.WEEKLY
                },
                {
                  label: t('Session.repetition.frequency', {
                    frequency: 'monthly'
                  }),
                  value: Frequency.MONTHLY
                },
                {
                  label: t('Session.repetition.frequency', {
                    frequency: 'yearly'
                  }),
                  value: Frequency.YEARLY
                }
              ]}
            />
            <Flexbox>
              {days.map((day, key) => (
                <DayTag
                  key={key}
                  selected={(repetition?.days ?? []).includes(day.value)}
                  onClick={() => handleSelectDay(day.value)}>
                  {day.label}
                </DayTag>
              ))}
            </Flexbox>

            <Flexbox>
              <Flexbox alignItems='center'>
                <FontAwesomeIcon icon={faCalendarCheck as any} />
                <p
                  style={{
                    marginLeft: '10px'
                  }}>
                  {t('Session.until')}
                </p>
              </Flexbox>
              <InputGroup
                type='date'
                id='end'
                name='end'
                value={repetition?.end ?? ''}
                styling={{
                  root: {
                    marginBottom: '0',
                    marginRight: '10px',
                    marginLeft: '10px'
                  },
                  input: {
                    height: '38px'
                  }
                }}
                onInputChange={handleInputChange}
              />
            </Flexbox>
            <Flexbox
              style={{
                marginTop: '10px'
              }}>
              <Button
                type='button'
                onClick={handleGenerate}
                style={{
                  color: '#fff'
                }}>
                {t('Session.generate')}
                {loading ? (
                  <FontAwesomeIcon
                    style={{
                      color: '#fff'
                    }}
                    icon={faSpinner as any}
                    className='fa-pulse'
                  />
                ) : null}
              </Button>
              {occurrences?.length ? (
                <Occurrences
                  occurrences={occurrences}
                  sessionId={selectedSession?._id}
                  onSaveOccurrences={handleSaveOccurrences}
                />
              ) : null}
            </Flexbox>
          </Flexbox>
        </Flexbox>
      ) : (
        <Button onClick={handleAddRepetion}>
          {t('Session.repetition.addRepetition')}
        </Button>
      )}
    </Root>
  );
};
