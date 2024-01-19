import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useFirebaseStorage } from '@/src/app/contexts/storage/useFirebaseStorage';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { GalleryListItem } from './GalleryListItem';
import { getDownloadURL } from 'firebase/storage';
import { ImageLoaderDialog } from './ImageLoaderDialog';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { IImageType } from './types';

const Root = styled.div`
  display: flex;
  flex-direction: column;
`;
const List = styled.ul`
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  background-color: #fff;
  margin: 20px;
  border-radius: 8px;
  padding: 10px;
`;
const Button = styled.button``;

interface Props {
  onSelectImage: (image: IImageType) => void;
  selectedImages: IImageType[];
  entitySelectedImages: IImageType[];
}
export const Gallery = ({
  selectedImages,
  onSelectImage,
  entitySelectedImages,
}: Props) => {
  const { listFilesInFolder } = useFirebaseStorage();
  const [images, setImages] = useState<IImageType[]>([]);

  const { open, onOpen, onClose } = useToggle();

  useEffect(() => {
    const fetchFiles = async () => {
      const files = await listFilesInFolder(ENUM_COLLECTIONS.MEDIAS);
      return files;
    };

    fetchFiles()
      .then(async (files) => {
        const urls = await Promise.all(
          files.map(async (fileRef) => {
            const url = await getDownloadURL(fileRef);
            return {
              name: fileRef.name,
              url,
            };
          })
        );
        setImages(urls);
      })
      // eslint-disable-next-line no-console
      .catch((error) => console.log(error));
  }, []);

  const handleAddNewImages = (newImages: IImageType[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <Root>
      <Flexbox
        style={{
          padding: '10px',
          borderBottom: '1px solid var(--card-header-border-color)',
          backgroundColor: '#fff',
        }}>
        <Button className='button' type='button' onClick={onOpen}>
          Importer
        </Button>
      </Flexbox>
      <ImageLoaderDialog
        open={open}
        onClose={onClose}
        onAddNewImages={handleAddNewImages}
      />
      <List>
        {images.map((image, key) => (
          <GalleryListItem
            key={key}
            image={image}
            selected={selectedImages.some((prev) => prev.url === image.url)}
            onSelectImage={onSelectImage}
            previouslySelected={entitySelectedImages.some(
              (prev) => prev.url === image.url
            )}
          />
        ))}
      </List>
    </Root>
  );
};
