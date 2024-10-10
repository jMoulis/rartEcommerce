import { IProductImage } from '@/src/types/DBTypes';
import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

const Root = styled.div`
  position: relative;
  height: 40vh;
  flex: 1;
  margin: 0 10px;
  width: 50vw;
  @media (max-width: 768px) {
    min-width: 100%;
    max-width: 100%;
    min-height: 40vh;
    margin: 10px 0;
  }
`;

interface Props {
  image: IProductImage | null;
}

export const MainImage = ({ image }: Props) => {
  return (
    <Root>
      {image ? (
        <Image
          fill
          priority
          alt={image.name}
          src={image.url}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          style={{
            borderRadius: '8px',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
        />
      ) : null}
    </Root>
  );
};
