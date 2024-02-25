import { ISession, IWorkshop } from '@/src/types/DBTypes';
import React from 'react';
import { SessionListItem } from './SessionListItem';
import styled from '@emotion/styled';

const Root = styled.ul``;

interface Props {
  sessions: ISession[];
  workshop: IWorkshop;
}

export const SessionList = ({ workshop, sessions }: Props) => {
  return (
    <Root>
      {sessions.map((session, key) => (
        <SessionListItem key={key} workshop={workshop} session={session} />
      ))}
    </Root>
  );
};
