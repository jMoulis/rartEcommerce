import { IImageType } from './types';
import { useTranslations } from 'next-intl';
import React, { ChangeEvent } from 'react';
import { faAdd, faImages } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { GalleryDialog } from './GalleryDialog';
import { Article } from '../Article';
import { ImageLoaderItem } from './ImageLoaderItem';
import './style.css';

const Button = styled.button`
  padding: 20px;
  border-radius: 8px;
  background-color: #eaf7ff;
  text-transform: uppercase;
  display: flex;
  cursor: pointer;
  margin: 10px;
  align-items: center;
  &:hover {
    background-color: #c6e2f7;
  }
`;
interface Props {
  images: IImageType[];
  onSubmitImages: (images: IImageType[]) => void;
  single?: boolean;
}

export const ImageLoader = ({ images, onSubmitImages, single }: Props) => {
  const t = useTranslations('ProductForm');
  const { open, onOpen, onClose } = useToggle();

  const handleSubmit = async (incomingImages: IImageType[]) => {
    onSubmitImages([...images, ...incomingImages]);
    onClose();
  };

  const handleChangeDefault = (
    event: ChangeEvent<HTMLInputElement>,
    image: IImageType
  ) => {
    const { checked } = event.currentTarget;
    const updatedImages = images.filter((prev) => prev.url !== image.url);

    if (checked) {
      updatedImages.unshift({ ...image, default: true });
    }
    const finalImages = updatedImages.map((prev) => ({
      ...prev,
      default: prev.url === image.url,
    }));
    onSubmitImages(finalImages);
  };

  const handleDeleteImage = (imageUrl: string) => {
    const updatedImages = images.filter((prev) => prev.url !== imageUrl);
    onSubmitImages(updatedImages);
  };
  return (
    <>
      <Article
        headerTitle={t('images')}
        styling={{
          root: {
            flex: 1,
            marginRight: '10px',
          },
          body: {
            flexDirection: 'row',
          },
        }}>
        <ul className='gallery'>
          {images.map((image, key) => (
            <ImageLoaderItem
              key={key}
              index={key}
              image={image}
              onChangeDefault={handleChangeDefault}
              onDeleteImage={handleDeleteImage}
            />
          ))}

          {single && images.length ? (
            <div />
          ) : (
            <li>
              <Button onClick={onOpen}>
                {!images?.length ? (
                  <>
                    <Flexbox flex='1'>
                      <FontAwesomeIcon icon={faImages} />
                    </Flexbox>
                    <span
                      style={{
                        display: 'block',
                        flex: '2',
                        textAlign: 'center',
                      }}>
                      {t('addImages' as any)}
                    </span>
                  </>
                ) : (
                  <FontAwesomeIcon icon={faAdd} />
                )}
              </Button>
            </li>
          )}
        </ul>
      </Article>
      <GalleryDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        prevImages={images}
      />
    </>
  );
};
