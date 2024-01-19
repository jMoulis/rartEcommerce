import React, { ChangeEvent } from 'react';
import { IImageType } from './types';
import Image from 'next/image';
import { HoveredMenu } from './HoveredMenu';
import styled from '@emotion/styled';

const Root = styled.li`
  position: relative;
  &:hover {
    .hovered-image-menu {
      opacity: 1;
    }
  }
`;

interface Props {
  image: IImageType;
  onChangeDefault: (
    event: ChangeEvent<HTMLInputElement>,
    image: IImageType
  ) => void;
  checked?: boolean;
  onDeleteImage: (imageId: string) => void;
  index: number;
}

export const ImageLoaderItem = ({
  image,
  onChangeDefault,
  onDeleteImage,
  index,
}: Props) => {
  return (
    <Root className={`gallery-item ${index === 0 ? 'gallery-item-1' : ''}`}>
      <HoveredMenu
        id={index}
        onChangeDefault={(event) => onChangeDefault(event, image)}
        checked={image.default}
        onDeleteImage={() => onDeleteImage(image.url)}
      />
      <Image
        src={image.url}
        fill
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        alt={image.name}
        style={{
          borderRadius: '10px',
        }}
      />
    </Root>
  );
};
