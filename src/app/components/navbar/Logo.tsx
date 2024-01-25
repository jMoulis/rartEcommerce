import React from 'react';
import styled from '@emotion/styled';
import Image from 'next/image';
import Link from 'next/link';
import { ENUM_ROUTES } from './routes.enums';

const CustomLink = styled(Link)`
  width: 100px;
  height: 100px;
`;

export const Logo = () => {
  return (
    <CustomLink href={ENUM_ROUTES.HOME}>
      <Image src='' alt='Rart-creation' />
    </CustomLink>
  );
};
