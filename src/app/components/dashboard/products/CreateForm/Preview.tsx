import React from 'react';
import { FullDialog } from '../../../commons/dialog/FullDialog';
import { useTranslations } from 'next-intl';
import { IProductService, IWorkshop } from '@/src/types/DBTypes';

interface Props {
  open: boolean;
  onClose: () => void;
  preview: IProductService | IWorkshop | null;
  children: React.ReactNode;
}

const Preview = ({ open, onClose, children }: Props) => {
  const t = useTranslations();

  return (
    <div>
      <FullDialog
        open={open}
        onClose={onClose}
        dialog={{
          fullWidth: true,
          fullScreen: true,
        }}
        styling={{
          content: {
            height: '20vh',
            minHeight: '20vh',
          },
        }}
        header={{
          title: t('commons.preview'),
        }}>
        {children}
      </FullDialog>
    </div>
  );
};

export default Preview;
