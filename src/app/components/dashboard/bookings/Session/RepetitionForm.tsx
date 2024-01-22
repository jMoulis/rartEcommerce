import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Selectbox } from '../../../commons/form/Selectbox';
import { useForm } from '../../../hooks/useForm';
import { useTranslations } from 'next-intl';
import { Flexbox } from '../../../commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faRepeat } from '@fortawesome/pro-light-svg-icons';
import { IRepetition, ISession, IOccurence } from '@/src/types/DBTypes';
import { InputGroup } from '../../../commons/form/InputGroup';
import { Button } from '../../../commons/Buttons/Button';
import { ByWeekday, Frequency } from './types';
import { APIResponse } from '@/src/types/types';
import { generateDefaultRepetition } from '../../products/CreateForm/defaultData';

const days: Array<{
  label: string;
  value: ByWeekday;
}> = [
  {
    label: 'L',
    value: 'MO',
  },
  {
    label: 'M',
    value: 'TU',
  },
  {
    label: 'M',
    value: 'WE',
  },
  {
    label: 'J',
    value: 'TH',
  },
  {
    label: 'V',
    value: 'FR',
  },
  {
    label: 'S',
    value: 'SA',
  },
  {
    label: 'D',
    value: 'SU',
  },
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
    selected ? 'var(--primary-color)' : ''};

  color: ${({ selected }) => (selected ? '#fff' : '')};
`;

interface Props {
  repetition?: IRepetition;
  location?: string;
  startDate?: string;
  onSubmit: (rule: string) => void;
  onChange: React.Dispatch<React.SetStateAction<ISession>>;
  until?: string;
}

export const RepetitionForm = ({
  location,
  repetition,
  startDate,
  until,
  onSubmit,
  onChange,
}: Props) => {
  // const { form, onInputChange, onDirectMutation, onInitForm } =
  //   useForm<IRepetition>();
  const t = useTranslations();

  useEffect(() => {
    if (!repetition) {
      const defaultRepetition = generateDefaultRepetition();
      onChange((prev) => ({
        ...prev,
        repetition: defaultRepetition,
      }));
    }
  }, [repetition]);

  // useEffect(() => {
  //   if (startDate) {
  //     onDirectMutation((prev) => ({
  //       ...prev,
  //       start: startDate,
  //     }));
  //   }
  // }, [startDate]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { value, name } = event.currentTarget;
    onChange((prev) => ({
      ...prev,
      repetition: {
        ...prev.repetition,
        [name]: value as any,
      },
    }));
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
      days: updatedDays,
    };
    onChange((prev) => ({
      ...prev,
      repetition: updatedRepetition,
    }));
  };

  return (
    <Root>
      <Flexbox alignItems='flex-start'>
        <Flexbox alignItems='center'>
          <FontAwesomeIcon icon={faRepeat} />
          <p
            style={{
              marginLeft: '10px',
            }}>
            {t('Session.repetition.label')}
          </p>
        </Flexbox>
        <Flexbox flexDirection='column'>
          <Selectbox
            id='frequency'
            name='frequency'
            onSelectOption={handleInputChange}
            styling={{
              root: {
                margin: 0,
              },
            }}
            options={[
              {
                label: t('commons.select'),
                value: '',
              },
              {
                label: t('Session.repetition.frequency', {
                  frequency: 'daily',
                }),
                value: Frequency.DAILY,
              },
              {
                label: t('Session.repetition.frequency', {
                  frequency: 'weekly',
                }),
                value: Frequency.WEEKLY,
              },
              {
                label: t('Session.repetition.frequency', {
                  frequency: 'monthly',
                }),
                value: Frequency.MONTHLY,
              },
              {
                label: t('Session.repetition.frequency', {
                  frequency: 'yearly',
                }),
                value: Frequency.YEARLY,
              },
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
        </Flexbox>
      </Flexbox>
    </Root>
  );
};
