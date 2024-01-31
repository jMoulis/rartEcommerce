import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import Link from 'next/link';

const Root = styled(Link)`
  label: Root;
  max-width: 200px;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 200px;
  min-width: 200px;
  margin: 0 20px;
  cursor: pointer;
  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    height: 300px;
    margin: 30px 0;
    flex: 1;
  }
`;
const ImageContent = styled.div`
  label: ImageContent;
  position: relative;
  height: 150px;
  margin-bottom: 5px;
  min-height: 150px;
  @media (max-width: 768px) {
    width: 100%;
    height: 250px;
    margin-bottom: 15px;
  }
`;

const Text = styled.p`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal;
  -webkit-box-orient: vertical;
  line-height: 18px;
`;
const Price = styled(Text)`
  font-weight: 700;
`;
const Title = styled.h2`
  color: var(--white);
  font-weight: 700;
  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

interface Props {
  title: string;
  src?: string;
  textColor: string;
  price: number;
  description: string;
  id: string;
  hrefRoot: string;
}

export const Card = ({
  title,
  src,
  textColor,
  price,
  description,
  id,
  hrefRoot,
}: Props) => {
  return (
    <Root href={`/${hrefRoot}/${id}`}>
      <ImageContent>
        <Image
          fill
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '10px',
          }}
          sizes='500px'
          alt={title}
          src={src ?? ''}
        />
      </ImageContent>
      <Title
        style={{
          color: textColor,
        }}>
        {title}
      </Title>
      <Text
        style={{
          flex: 1,
        }}>
        {description}
      </Text>
      <Price>{price}€</Price>
    </Root>
  );
};
