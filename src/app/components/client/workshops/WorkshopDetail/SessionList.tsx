import { ISession, IWorkshop } from '@/src/types/DBTypes';
import React from 'react';
import { SessionListItem } from './SessionListItem';
import styled from '@emotion/styled';

const Root = styled.ul`
  flex: 1;
`;

interface Props {
  sessions: ISession[];
  workshop: IWorkshop;
  preview: boolean;
}

export const SessionList = ({ workshop, sessions, preview }: Props) => {
  return (
    <Root>
      {sessions.map((session, key) => (
        <SessionListItem
          key={key}
          workshop={workshop}
          preview={preview}
          session={session}
        />
      ))}
    </Root>
  );
};
