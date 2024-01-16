import { Dialog } from '@mui/material';
import React from 'react';
import { useToggle } from '../../hooks/useToggle';
import { useTranslations } from 'next-intl';
import { DialogHeader } from './DialogHeader';
import { DialogContent } from './DialogContent';
import { DialogFooter } from './DialogFooter';

interface Props {
  children?: React.ReactNode;
  headerTitle: string;
  actions: Array<{
    label: string;
    callback: () => Promise<any>;
  }>;
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
      <button type='button' onClick={onOpen}>
        {t('delete')}
      </button>
      <Dialog open={open} onClose={onClose}>
        <DialogHeader onClose={onClose} title={headerTitle} />
        <DialogContent>{children}</DialogContent>
        <DialogFooter actions={actions} onClose={onClose} />
      </Dialog>
    </>
  );
};
