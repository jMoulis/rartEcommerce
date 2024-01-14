'use client';

import React from 'react';
import Link from 'next/link';
import LocaleSwitcher from './LocaleSwitcher';
import styled from '@emotion/styled';
import { ProfileMenu } from './ProfileMenu/ProfileMenu';
import { useUserSession } from '../../contexts/auth/hooks/useUserSession';

const Root = styled.header`
  display: flex;
`;

export const Navbar = () => {
  useUserSession();
  return (
    <Root>
      <Link href='/'>Store</Link>
      <LocaleSwitcher />
      <ProfileMenu />
    </Root>
  );
};
