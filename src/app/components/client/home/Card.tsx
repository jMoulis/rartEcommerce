import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import { Subtitle } from '../commons/typography/Subtitle';

const Root = styled.div`
  label: Root;
  width: 500px;
  height: 350px;
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 400px;
  flex: 1;
  margin: 0 40px;
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    height: 300px;
    margin: 30px 0;
  }
`;
const ImageContent = styled.div`
  label: ImageContent;
  width: 100%;
  position: relative;
  height: 250px;
  margin-bottom: 20px;
  min-height: 250px;
  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
    margin-bottom: 15px;
  }
`;

interface Props {
  title: string;
  imageIndex: number;
  root: string;
  textColor: string;
}

export const Card = ({ imageIndex, title, root, textColor }: Props) => {
  return (
    <Root>
      <ImageContent>
        <Image
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '10px',
          }}
          alt={title}
          src={`${root}${imageIndex + 1}.webp`}
        />
      </ImageContent>
      <Subtitle
        style={{
          color: textColor,
        }}>
        {title}
      </Subtitle>
    </Root>
  );
};
