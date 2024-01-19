import Image from 'next/image';
import React from 'react';
import styled from '@emotion/styled';
import { Flexbox } from '@/src/app/components/commons/Flexbox';
import { useTranslations } from 'next-intl';
import { IImageType } from './types';
import { Button } from '@/src/app/components/commons/Buttons/Button';

const Root = styled.div<{ selected: boolean }>`
  width: 160px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: unset;
  cursor: pointer;
`;

const SelectedIndicator = styled.i`
  display: flex;
  height: 20px;
  width: 20px;
  position: absolute;
  z-index: 1;
  background-color: rgba(255, 0, 0, 0.5);
  bottom: 0;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const FileName = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  text-align: center;
  font-size: 13px;
`;

const ImageWrapper = styled(Flexbox)`
  position: relative;
  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
interface Props {
  image: IImageType;
  onSelectImage: (image: IImageType) => void;
  selected: boolean;
  previouslySelected: boolean;
}

export const GalleryListItem = ({
  image,
  onSelectImage,
  selected,
  previouslySelected,
}: Props) => {
  const t = useTranslations();

  return (
    <Root selected={selected}>
      <ImageWrapper
        style={{
          marginBottom: '10px',
          border: `2px solid ${selected ? ' #3899ec' : 'transparent'}`,
        }}>
        <Image
          alt='image'
          src={image.url}
          width={150}
          height={150}
          quality={50}
          loading='lazy'
          style={{
            objectFit: 'contain',
            borderRadius: '5px',
          }}
        />
        {previouslySelected ? <SelectedIndicator /> : null}
      </ImageWrapper>
      <FileName>{image.name}</FileName>
      <Flexbox
        justifyContent='center'
        style={{
          marginTop: '10px',
        }}>
        <Button
          onClick={() => onSelectImage(image)}
          className='button'
          style={{
            backgroundColor: selected ? 'rgba(0,0,0,0.1)' : undefined,
            color: selected ? 'var(--default-font-color)' : undefined,
          }}>
          {selected ? t('commons.remove') : t('commons.select')}
        </Button>
      </Flexbox>
    </Root>
  );
};
