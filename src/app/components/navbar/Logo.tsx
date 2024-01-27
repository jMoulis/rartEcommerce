import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { ENUM_ROUTES } from './routes.enums';

const CustomLink = styled(Link)`
  /* width: 50px;
  height: 50px; */
`;

interface Props {
  size?: {
    width?: number;
    height?: number;
  };
}
export const Logo = ({ size }: Props) => {
  return (
    <CustomLink href={ENUM_ROUTES.HOME}>
      <Image
        src='/images/logo.png'
        height={size?.height ?? 50}
        width={size?.width ?? 50}
        alt='Rart-creation'
        style={{
          borderRadius: '10px',
        }}
      />
    </CustomLink>
  );
};
