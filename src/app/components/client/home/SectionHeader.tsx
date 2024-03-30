'use client';

import { Section } from '../commons/layout/Section';
import { Title } from '../commons/typography/Title';
import Image from 'next/image';
import { Flexbox } from '../../commons/Flexbox';
import styled from '@emotion/styled';
import logo from './logoR.svg';
import { ReactNode } from 'react';

const BackgroundImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const ImageContent = styled(Flexbox)`
  position: relative;
  height: 70px;
  width: 70px;
  margin-bottom: 50px;
  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;
const TitleWrapper = styled(Flexbox)`
  backdrop-filter: blur(23.75px);
  width: 749px;
  align-items: center;
  flex-direction: column;
  padding: 30px;
  border-radius: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  @media (max-width: 768px) {
    width: unset;
    margin-bottom: 30px;
  }
`;

const ContentWrapper = styled(Flexbox)`
  z-index: 10;
  padding: 0 30px;
  padding-top: 70px;
  align-items: center;
  @media (max-width: 768px) {
    padding: 0;
    padding-top: 30px;
  }
`;

interface Props {
  backgroundImage: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export default function SectionHeader({
  backgroundImage,
  title,
  description,
  children,
}: Props) {
  return (
    <>
      <Section>
        <BackgroundImageWrapper>
          <Image
            alt={title}
            src={backgroundImage}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            style={{
              objectFit: 'cover',
            }}
          />
        </BackgroundImageWrapper>
        <ContentWrapper flexDirection='column'>
          <ImageContent>
            <Image
              fill
              alt='Logo'
              src={logo}
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            />
          </ImageContent>
          <TitleWrapper>
            <Title
              style={{
                marginBottom: '20px',
              }}>
              {title}
            </Title>
            <p
              style={{
                color: 'var(--white)',
                fontSize: '18px',
              }}>
              {description}
            </p>
          </TitleWrapper>
          {children}
        </ContentWrapper>
      </Section>
    </>
  );
}
