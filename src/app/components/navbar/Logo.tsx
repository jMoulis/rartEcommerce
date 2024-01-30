import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { ENUM_ROUTES } from './routes.enums';

const CustomLink = styled(Link)<{
  size?: {
    width?: string;
    height?: string;
    responsiveWidth?: string;
    responsiveHeight?: string;
  };
}>`
  position: relative;
  width: ${({ size }) => size?.width ?? '50px'};
  height: ${({ size }) => size?.height ?? '50px'};
  @media (max-width: 768px) {
    width: ${({ size }) => size?.responsiveWidth ?? '30px'};
    height: ${({ size }) => size?.responsiveHeight ?? '30px'};
  }
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
      <Image
        src='/images/logo.png'
        // height={size?.height ?? 50}
        // width={size?.width ?? 50}
        alt='Rart-creation'
        fill
        style={{
          borderRadius: '10px',
        }}
      />
    </CustomLink>
  );
};
