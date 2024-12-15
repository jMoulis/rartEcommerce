import { Dialog } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useTranslations } from 'next-intl';
import { Gallery } from './Gallery';
import { IImageType } from './types';
import { CloseModalButton } from '@/src/app/components/commons/Buttons/CloseModalButton';

const Content = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  background-color: var(--background-section-color);
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
  onSubmit: (images: IImageType[]) => void;
  prevImages: IImageType[];
}

export const GalleryDialog = ({
  open,
  onClose,
  onSubmit,
  prevImages
}: Props) => {
  const tCommons = useTranslations('commons');
  const [selectedImages, setSelectedImages] = useState<IImageType[]>([]);

  const handleSelectImage = (image: IImageType) => {
    const exists = selectedImages.some((prev) => prev.url === image.url);
    if (exists) {
      setSelectedImages((prev) =>
        prev.filter((prevImage) => prevImage.url !== image.url)
      );
    } else {
      setSelectedImages((prev) => [...prev, image]);
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedImages);
    setSelectedImages([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth='lg'>
      <Header>
        <h2>{tCommons('selectImages')}</h2>
        <CloseModalButton onClose={onClose} />
      </Header>
      <Content>
        <Gallery
          onSelectImage={handleSelectImage}
          selectedImages={selectedImages}
          entitySelectedImages={prevImages}
          onSubmit={handleSubmit}
          onClear={() => setSelectedImages([])}
        />
      </Content>
    </Dialog>
  );
};
