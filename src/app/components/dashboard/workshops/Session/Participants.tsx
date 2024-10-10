import { ISessionParticipant } from '@/src/types/DBTypes';
import React from 'react';
import ParticipantCard from './ParticipantCard';

interface Props {
  participants: ISessionParticipant[];
}

const Participants = ({ participants = [] }: Props) => {
  return (
    <div>
      {participants.map((participant, key) => (
        <ParticipantCard participant={participant} key={key} />
      ))}
    </div>
  );
};

export default Participants;
