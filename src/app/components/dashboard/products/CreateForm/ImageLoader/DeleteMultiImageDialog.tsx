import { Dialog } from '@mui/material';
import React from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { CloseModalButton } from '@/src/app/components/commons/Buttons/CloseModalButton';
import Image from 'next/image';
import { CancelButton } from '@/src/app/components/commons/Buttons/CancelButton';
import { DeleteButton } from '@/src/app/components/commons/Buttons/DeleteButton';
import { useFirebaseStorage } from '@/src/app/contexts/storage/useFirebaseStorage';
import { IImageType } from './types';

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid var(--card-header-border-color);
`;

interface Props {
  open: boolean;
  onClose: VoidFunction;
  selectedImages: IImageType[];
  onDeleteSucess: () => void;
}

export const DeleteMultiImageDialog = ({
  open,
  onClose,
  selectedImages,
  onDeleteSucess
}: Props) => {
  const { onDeleteFiles } = useFirebaseStorage();
  const t = useTranslations('ProductForm');
  const tCommons = useTranslations('commons');
  const handleDelete = async () => {
    await onDeleteFiles(selectedImages.map((image) => image.url));
    onDeleteSucess();
  };
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <Header>
        <h2>{t('deleteImages')}</h2>
        <CloseModalButton onClose={onClose} />
      </Header>
      <Flexbox flexWrap='wrap'>
        {selectedImages.map((image) => (
          <Flexbox key={image.url}>
            <Image
              src={image.url}
              alt='image'
              width='50'
              height='50'
              sizes='50px'
              style={{
                borderRadius: '5px',
                objectFit: 'cover',
                margin: '10px'
              }}
            />
          </Flexbox>
        ))}
      </Flexbox>
      <Flexbox justifyContent='end' style={{ padding: '10px' }}>
        <DeleteButton onClick={handleDelete} type='button'>
          {tCommons('delete')}
        </DeleteButton>
        <CancelButton onClick={onClose}>{tCommons('cancel')}</CancelButton>
      </Flexbox>
    </Dialog>
  );
};
