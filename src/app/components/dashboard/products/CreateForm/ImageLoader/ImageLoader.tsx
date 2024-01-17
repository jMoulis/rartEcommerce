import { IImageType } from './types';
import { useTranslations } from 'next-intl';
import React from 'react';
import { faAdd, faImages } from '@fortawesome/pro-light-svg-icons';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToggle } from '@/src/app/components/hooks/useToggle';
import { GalleryDialog } from './GalleryDialog';

import Image from 'next/image';

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
}

export const ImageLoader = ({ images, onSubmitImages }: Props) => {
  const t = useTranslations('ProductForm');
  const { open, onOpen, onClose } = useToggle();

  const handleSubmit = async (incomingImages: IImageType[]) => {
    console.log(incomingImages);
    onSubmitImages([...images, ...incomingImages]);
    onClose();
  };

  return (
    <>
      <article className='card'>
        <header className='card-header'>
          <h1>{t('images')}</h1>
        </header>
        <div className='card-content'>
          <ul className='gallery'>
            {images.map((image, key) => (
              <li
                key={key}
                className={`gallery-item ${key === 0 ? 'gallery-item-1' : ''}`}>
                <Image
                  src={image.url}
                  fill
                  alt={image.name}
                  style={{
                    borderRadius: '10px',
                  }}
                />
              </li>
            ))}
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
          </ul>
        </div>
      </article>
      <GalleryDialog
        open={open}
        onClose={onClose}
        onSubmit={handleSubmit}
        prevImages={images}
      />
    </>
  );
};
