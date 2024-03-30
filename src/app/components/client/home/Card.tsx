import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';
import Link from 'next/link';
// import { useTranslations } from 'next-intl';
import { Flexbox } from '../../commons/Flexbox';

const Root = styled.li<{ boxShadow: string }>`
  display: flex;
  flex-direction: column;
  max-width: 250px;
  min-width: 250px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 5px;
  box-shadow: ${({ boxShadow }) => `0 0 10px ${boxShadow}`};
  transition: box-shadow 0.3s;
  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }
`;
const TextWrapper = styled.div`
  label: TextWrapper;
  padding: 5px;
`;

const CustomLink = styled(Link)`
  label: Root;
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  @media (max-width: 768px) {
    /* width: 100%;
    min-width: 100%;
    height: 300px;
    margin: 30px 0;
    flex: 1; */
  }
`;
const ImageContent = styled.div`
  label: ImageContent;
  position: relative;
  height: 250px;
  margin-bottom: 5px;
  overflow: hidden;
  border-radius: 5px 5px 0 0;
  &:hover {
    img {
      transition: transform ease 1s;
      transform: scale(1.3);
    }
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 150px;
    margin-bottom: 15px;
  }
`;

const Text = styled.p`
  -webkit-line-clamp: 2;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: normal;
  -webkit-box-orient: vertical;
  line-height: 18px;
  text-align: justify;
  font-size: var(--default-font-size);
  margin-bottom: 10px;
`;
const Description = styled(Text)`
  @media (max-width: 768px) {
    display: none;
  }
`;
// const PriceLabel = styled(Text)`
//   font-weight: 400;
//   margin-bottom: 0;
//   margin-right: 10px;
// `;
const Price = styled(Text)`
  font-weight: 700;
  margin-bottom: 0;
`;
const Footer = styled.footer`
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  display: flex;
  @media (max-width: 768px) {
    padding: 5px;
    flex-direction: column;
    align-items: unset;
  }
`;

const Title = styled.h2`
  color: var(--white);
  font-size: 24px;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    margin-bottom: 10px;
    margin-top: 0;
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
  children: React.ReactNode;
  boxShadow: string;
}

export const Card = ({
  title,
  src,
  textColor,
  price,
  description,
  id,
  hrefRoot,
  children,
  boxShadow,
}: Props) => {
  // const t = useTranslations();

  return (
    <Root boxShadow={boxShadow}>
      <CustomLink href={`/${hrefRoot}/${id}`}>
        <ImageContent>
          <Image
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{
              objectFit: 'cover',
              objectPosition: 'center',
              borderRadius: '5px 5px 0 0',
            }}
            alt={title}
            src={src ?? ''}
          />
        </ImageContent>
        <TextWrapper>
          <Title
            style={{
              color: textColor,
              marginBottom: '10px',
              marginTop: '0',
            }}>
            {title}
          </Title>
          <Description
            style={{
              flex: 1,
            }}>
            {description}
          </Description>
        </TextWrapper>
      </CustomLink>
      <Footer>
        <Flexbox>
          {/* <PriceLabel>{t('commons.price')}</PriceLabel> */}
          <Price>{price}€</Price>
        </Flexbox>
        {children}
      </Footer>
    </Root>
  );
};
