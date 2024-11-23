import { Dialog } from '@mui/material';
import React from 'react';
import { useToggle } from '../../hooks/useToggle';
import { useTranslations } from 'next-intl';
import { DialogHeader } from '../dialog/DialogHeader';
import { DialogContent } from '../dialog/DialogContent';
import { DialogFooter } from './DialogFooter';
import { IAction } from './types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/pro-light-svg-icons';
import { Button } from '../Buttons/Button';

interface Props {
  children?: React.ReactNode;
  headerTitle: string;
  actions: IAction[];
  withIcon?: boolean;
  withLabel: boolean;
  className?: string;
  CustomDelete?: React.ReactNode;
}

export const DeleteConfirmation = ({
  children,
  headerTitle,
  actions,
  withIcon,
  withLabel,
  className,
  CustomDelete
}: Props) => {
  const { open, onOpen, onClose } = useToggle();
  const t = useTranslations('commons');

  return (
    <>
      {CustomDelete ? (
        <span onClick={onOpen}>{CustomDelete}</span>
      ) : (
        <Button
          type='button'
          className={`${className ?? ''}`}
          style={{
            backgroundColor: 'var(--error-color)'
          }}
          onClick={onOpen}>
          {withIcon ? <FontAwesomeIcon icon={faTrash as any} /> : null}
          {withLabel ? t('delete') : null}
        </Button>
      )}

      <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
        <DialogHeader onClose={onClose} title={headerTitle} />
        <DialogContent height='20vh'>{children}</DialogContent>
        <DialogFooter actions={actions} onClose={onClose} />
      </Dialog>
    </>
  );
};
