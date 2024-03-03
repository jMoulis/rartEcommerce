import { ISession } from '@/src/types/DBTypes';
import React from 'react';
import { SessionListItem } from './SessionListItem';

interface Props {
  sessions: ISession[];
  onSelectSession: (session: ISession) => void;
}

export const SessionList = ({ sessions, onSelectSession }: Props) => {
  return (
    <ul>
      {sessions.map((session, key) => (
        <SessionListItem
          key={key}
          session={session}
          onSelectSession={onSelectSession}
          showParticipant
          showAvaialable
        />
      ))}
    </ul>
  );
};
