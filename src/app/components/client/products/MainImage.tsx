import { IProductImage } from '@/src/types/DBTypes';
import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';

const Root = styled.div`
  position: relative;
  flex: 1;
  height: 40vh;
  margin: 0 10px;
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
