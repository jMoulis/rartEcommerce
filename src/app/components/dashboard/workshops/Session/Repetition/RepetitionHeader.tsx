import { Button } from '@/src/app/components/commons/Buttons/Button';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { IRepetition } from '@/src/types/DBTypes';
import { faRepeat } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslations } from 'next-intl';
import React from 'react';

interface Props {
  onDelete: (repetitionId: string) => void;
  repetition: IRepetition;
}

export const RepetitionHeader = ({ onDelete, repetition }: Props) => {
  const t = useTranslations();

  return (
    <Flexbox
      justifyContent='space-between'
      alignItems='center'
      style={{
        marginBottom: '10px',
      }}>
      <Flexbox>
        <FontAwesomeIcon icon={faRepeat} />
        <p
          style={{
            marginLeft: '10px',
          }}>
          {t('Session.repetition.label')}
        </p>
      </Flexbox>
      <Button
        type='button'
        style={{
          backgroundColor: 'transparent',
          color: 'var(--header-font-color)',
        }}
        onClick={() => onDelete(repetition._id!)}>
        X
      </Button>
    </Flexbox>
  );
};
