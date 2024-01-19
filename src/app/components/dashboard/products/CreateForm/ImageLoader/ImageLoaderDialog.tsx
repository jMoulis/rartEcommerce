import { Dialog } from '@mui/material';
import React, { ChangeEvent, useState } from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { AddImageButtonInput } from './AddImageButtonInput';
import { useFirebaseStorage } from '@/src/app/contexts/storage/useFirebaseStorage';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { ProgressionUploadingFile } from './ProgressionUploadingFile';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { IImageType } from './types';
import { CloseModalButton } from '@/src/app/components/commons/Buttons/CloseModalButton';

const Content = styled.div`
  margin: 50px;
  display: flex;
  border: 1px dashed #5999ff;
  flex-direction: column;
  border-radius: 5px;
  padding: 30px;
`;
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-bottom: 1px solid var(--card-header-border-color);
`;

interface Props {
  open: boolean;
  onClose: VoidFunction;
  onAddNewImages: (images: IImageType[]) => void;
}

export const ImageLoaderDialog = ({ open, onClose, onAddNewImages }: Props) => {
  const t = useTranslations('ProductForm');
  const tCommons = useTranslations('commons');
  const [files, setFiles] = useState<FileList | null>(null);
  const { onAddFile, progress, errors } = useFirebaseStorage();

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const { files } = event.currentTarget;
    if (files) {
      setFiles(files);
      const images: IImageType[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = `${ENUM_COLLECTIONS.MEDIAS}/`;
        const downloadURL = await onAddFile(file, filePath);
        const image: IImageType = {
          name: file.name,
          url: downloadURL ?? '',
        };
        images.push(image);
      }
      onAddNewImages(images);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='xs'>
      <Header>
        <h2>{t('addImages' as any)}</h2>
        <CloseModalButton onClose={onClose} />
      </Header>
      <Content>
        <p
          style={{
            marginBottom: '10px',
            textAlign: 'center',
          }}>
          {tCommons('dragAndDropFile')}
        </p>
        <p
          style={{
            marginBottom: '10px',
            textAlign: 'center',
          }}>
          {tCommons('or')}
        </p>
        <Flexbox justifyContent='center'>
          <AddImageButtonInput
            id='images'
            label={tCommons('importFiles')}
            onUpload={handleUploadImage}
          />
        </Flexbox>
      </Content>
      <ProgressionUploadingFile
        progressList={progress}
        files={files}
        errors={errors}
      />
    </Dialog>
  );
};
