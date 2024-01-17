import { Dialog } from '@mui/material';
import React from 'react';
import { useToggle } from '../../hooks/useToggle';
import { useTranslations } from 'next-intl';
import { DialogHeader } from '../dialog/DialogHeader';
import { DialogContent } from '../dialog/DialogContent';
import { DialogFooter } from './DialogFooter';
import { IAction } from './types';

interface Props {
  children?: React.ReactNode;
  headerTitle: string;
  actions: IAction[];
}

export const DeleteConfirmation = ({
  children,
  headerTitle,
  actions,
}: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const t = useTranslations('commons');

  return (
    <>
      <button type='button' className='button button-delete' onClick={onOpen}>
        {t('delete')}
      </button>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
        <DialogHeader onClose={onClose} title={headerTitle} />
        <DialogContent>{children}</DialogContent>
        <DialogFooter actions={actions} onClose={onClose} />
      </Dialog>
    </>
  );
};
