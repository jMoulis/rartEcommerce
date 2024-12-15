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
import { toast } from 'react-toastify';
import { DeleteMultiImageDialog } from './DeleteMultiImageDialog';
import { DeleteButton } from '@/src/app/components/commons/Buttons/DeleteButton';
import { useTranslations } from 'next-intl';
import { Button } from '@/src/app/components/commons/Buttons/Button';
import { CancelButton } from '@/src/app/components/commons/Buttons/CancelButton';

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
const Counter = styled.span`
  margin-right: 10px;
`;

interface Props {
  onSelectImage: (image: IImageType) => void;
  selectedImages: IImageType[];
  entitySelectedImages: IImageType[];
  onSubmit: () => void;
  onClear: () => void;
}
export const Gallery = ({
  selectedImages,
  onSelectImage,
  entitySelectedImages,
  onSubmit,
  onClear
}: Props) => {
  const { listFilesInFolder } = useFirebaseStorage();
  const [images, setImages] = useState<IImageType[]>([]);
  const { open, onOpen, onClose } = useToggle();
  const tCommons = useTranslations('commons');
  const tProduct = useTranslations('ProductForm');

  const {
    open: openDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog
  } = useToggle();

  const fetchFiles = async () => {
    try {
      const files = await listFilesInFolder(ENUM_COLLECTIONS.MEDIAS);
      const urls = await Promise.all(
        files.map(async (fileRef) => {
          const url = await getDownloadURL(fileRef);
          return {
            name: fileRef.name,
            url
          };
        })
      );
      setImages(urls);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleAddNewImages = (newImages: IImageType[]) => {
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDeleteImages = () => {
    fetchFiles();
    onCloseDeleteDialog();
  };
  return (
    <Root>
      <Flexbox
        style={{
          padding: '10px',
          borderBottom: '1px solid var(--card-header-border-color)',
          backgroundColor: '#fff',
          justifyContent: 'space-between'
        }}>
        <Button className='button' type='button' onClick={onOpen}>
          {tCommons('import')}
        </Button>
        <Flexbox alignItems='center'>
          <CancelButton
            style={{
              marginRight: '10px'
            }}
            type='button'
            onClick={onClear}
            disabled={!selectedImages.length}>
            <Counter>{selectedImages.length}</Counter>
            {tCommons('unselect')}
          </CancelButton>
          <Button
            style={{
              marginRight: '10px'
            }}
            type='button'
            onClick={onSubmit}
            disabled={!selectedImages.length}>
            {tProduct('addToProduct' as any)}
          </Button>

          <DeleteButton
            className='button'
            type='button'
            disabled={!selectedImages?.length}
            onClick={onOpenDeleteDialog}>
            {tCommons('delete')}
          </DeleteButton>
        </Flexbox>
      </Flexbox>
      <ImageLoaderDialog
        open={open}
        onClose={onClose}
        onAddNewImages={handleAddNewImages}
      />
      <DeleteMultiImageDialog
        open={openDeleteDialog}
        onClose={onCloseDeleteDialog}
        selectedImages={selectedImages}
        onDeleteSucess={handleDeleteImages}
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
