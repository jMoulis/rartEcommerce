import React, { useMemo, useState } from 'react';
import { Article } from '../../products/CreateForm/Article';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useToggle } from '../../../hooks/useToggle';
import { ISession, IWorkshop } from '@/src/types/DBTypes';
import { useTranslations } from 'next-intl';
import { Button } from '../../../commons/Buttons/Button';
import { Flexbox } from '../../../commons/Flexbox';
import { RecurrenceRule } from './RecurrenceRule';
import { generateDefaultSession } from '../../products/CreateForm/defaultData';
import { SessionList } from './SessionList';
import { SubmitButton } from '../../products/CreateForm/SubmitButton';
import { DeleteConfirmation } from '../../../commons/confirmation/DeleteConfirmation';
import { SessionForm } from './SessionForm';

interface Props {
  onUpsertSession: (session: ISession) => void;
  sessions: ISession[];
  onDeleteSession: (sessionId: string) => void;
  workshop: IWorkshop;
}

export const Session = ({
  onUpsertSession,
  sessions,
  onDeleteSession,
  workshop,
}: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const [selectedSession, setSelectedSession] = useState<ISession | null>(null);

  const t = useTranslations();

  const actions = useMemo(
    () => [
      {
        label: t('commons.delete'),
        callback: async () => {
          if (!selectedSession?._id) return;
          onDeleteSession?.(selectedSession._id);
          setSelectedSession(null);
          onClose();
        },
      },
    ],
    [selectedSession?._id]
  );
  const handleCloseForm = () => {
    onClose();
  };

  const handleSubmit = () => {
    if (!selectedSession) return;

    const recurrence = new RecurrenceRule({
      freq: selectedSession.repetition?.frequency,
      interval: selectedSession.repetition?.interval ?? 1,
      end: selectedSession.repetition?.end
        ? new Date(selectedSession.repetition?.end)
        : undefined,
      dtstart: selectedSession.start
        ? new Date(selectedSession.start)
        : undefined,
      byweekday: selectedSession.repetition?.days ?? [],
    });

    const repetitionRule = recurrence.toString();

    onUpsertSession({
      ...selectedSession,
      repetition: selectedSession?.repetition?._id
        ? {
            ...selectedSession?.repetition,
            rule: repetitionRule,
            start: selectedSession.start,
            end: selectedSession.end,
          }
        : null,
    });
    onClose();
  };

  const handleCreateSession = () => {
    const defaultSession = generateDefaultSession(workshop);
    onUpsertSession(defaultSession);
    setSelectedSession(defaultSession);
    onOpen();
  };

  const handleSelectionSession = (session: ISession) => {
    setSelectedSession(session);
    onOpen();
  };

  const handleUpdateSession = (session: ISession) => {
    setSelectedSession(session);
    onUpsertSession(session);
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
      {selectedSession ? (
        <FullDialog
          open={open}
          onClose={handleCloseForm}
          header={{
            title: t('Session.editSession'),
          }}
          dialog={{
            keepMounted: false,
            fullWidth: true,
            maxWidth: 'sm',
          }}>
          <SessionForm
            selectedSession={selectedSession}
            onDeleteSession={onDeleteSession}
            onUpdateSession={handleUpdateSession}
          />
          <Flexbox
            style={{
              marginTop: '20px',
              justifyContent: 'flex-end',
            }}>
            <SubmitButton onClick={handleSubmit} />
            <DeleteConfirmation withLabel headerTitle='"' actions={actions} />
          </Flexbox>
        </FullDialog>
      ) : null}
    </>
  );
};
