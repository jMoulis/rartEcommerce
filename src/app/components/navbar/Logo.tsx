import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { ENUM_ROUTES } from './routes.enums';
import logo from './logoR.svg';
import { Flexbox } from '../commons/Flexbox';

interface CustomLinkProps {
  size?: {
    width?: string;
    height?: string;
    responsiveWidth?: string;
    responsiveHeight?: string;
  };
}

const ImageContent = styled(Flexbox)`
  position: relative;
  height: 25px;
  width: 25px;
  @media (max-width: 768px) {
  }
`;
const CustomLink = styled(Link)<CustomLinkProps>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100%;
  background: url('/images/home/background.jpeg') no-repeat top;
  background-size: cover;
  min-width: 35px;
  min-height: 35px;
  /* @media (max-width: 768px) {
    width: ${({ size }) => size?.responsiveWidth ?? '35px'};
    height: ${({ size }) => size?.responsiveHeight ?? '35px'};
  } */
`;

interface Props {
  size?: {
    width?: string;
    height?: string;
    responsiveWidth?: string;
    responsiveHeight?: string;
  };
}
export const Logo = ({ size }: Props) => {
  return (
    <CustomLink href={ENUM_ROUTES.HOME} size={size}>
      <ImageContent>
        <Image
          fill
          alt='Logo'
          src={logo}
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        />
      </ImageContent>
      {/* <Image
        src='/images/logo.png'
        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
        alt='Rart-creation'
        fill
        style={{
          borderRadius: '100%',
        }}
      /> */}
    </CustomLink>
  );
};
