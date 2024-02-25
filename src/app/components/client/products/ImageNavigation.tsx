import { IProductImage } from '@/src/types/DBTypes';
import React, { Dispatch, SetStateAction } from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

const Root = styled.ul``;
const ListItem = styled.li<{ selected: boolean }>`
  cursor: pointer;
  position: relative;
  &::after {
    content: ' ';
    background-color: ${({ selected }) =>
      selected ? 'transparent' : 'rgba(255,255,255,0.5)'};
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  &:hover {
    &::after {
      background-color: transparent;
    }
  }
`;

interface Props {
  images: IProductImage[];
  selectedImage: IProductImage | null;
  onSelectImage: Dispatch<SetStateAction<IProductImage | null>>;
}

export const ImageNavigation = ({
  images,
  onSelectImage,
  selectedImage,
}: Props) => {
  return (
    <Root>
      {images.map((image, key) => (
        <ListItem
          selected={selectedImage?.url === image.url}
          key={key}
          onClick={() => onSelectImage(image)}>
          <Image
            width={45}
            height={45}
            alt={image.name}
            src={image.url}
            style={{
              objectFit: 'cover',
              borderRadius: '4px',
            }}
          />
        </ListItem>
      ))}
    </Root>
  );
};
