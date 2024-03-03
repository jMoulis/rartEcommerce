import { ISessionParticipant } from '@/src/types/DBTypes';
import React from 'react';
import { Flexbox } from '../../../commons/Flexbox';
import { useTranslations } from 'next-intl';

interface Props {
  participant: ISessionParticipant;
}

const ParticipantCard = ({ participant }: Props) => {
  const t = useTranslations();
  return (
    <div
      style={{
        marginBottom: '10px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        padding: '5px 10px',
        borderRadius: '5px',
      }}>
      <Flexbox>
        <span
          style={{
            fontWeight: 'bold',
            marginRight: '10px',
          }}>
          {t('commons.name')}
        </span>
        <span>{participant.name}</span>
      </Flexbox>
      <Flexbox>
        <span
          style={{
            fontWeight: 'bold',
            marginRight: '10px',
          }}>
          {t('commons.email')}
        </span>
        <span>{participant.email}</span>
      </Flexbox>
    </div>
  );
};
export default ParticipantCard;
