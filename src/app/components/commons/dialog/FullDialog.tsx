import React, { CSSProperties } from 'react';
import { Breakpoint, Dialog } from '@mui/material';
import { DialogHeader } from './DialogHeader';
import { DialogContentWrapper } from './DialogContent';

interface Props {
  children: React.ReactNode;
  dialog?: {
    fullWidth?: boolean;
    maxWidth?: Breakpoint;
    keepMounted?: boolean;
    fullScreen?: boolean;
  };
  header: {
    title: string;
  };
  onClose: VoidFunction;
  open: boolean;
  styling?: {
    root?: React.CSSProperties;
    header?: {
      root?: CSSProperties;
      title?: CSSProperties;
      button?: {
        root?: CSSProperties;
        icon?: CSSProperties;
      };
    };
    content?: React.CSSProperties;
  };
}

export const FullDialog = ({
  children,
  header,
  onClose,
  open,
  dialog,
  styling,
}: Props) => {
  return (
    <Dialog
      style={styling?.root}
      fullWidth={dialog?.fullWidth}
      maxWidth={dialog?.maxWidth}
      fullScreen={dialog?.fullScreen}
      open={open}
      keepMounted={dialog?.keepMounted}
      onClose={onClose}>
      <DialogHeader
        styling={styling?.header}
        title={header.title}
        onClose={onClose}
      />
      <DialogContentWrapper style={styling?.content}>
        {children}
      </DialogContentWrapper>
    </Dialog>
  );
};
