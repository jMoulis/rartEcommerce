'use client';

import React from 'react';
import Link from 'next/link';
import { User } from 'firebase/auth';
import LocaleSwitcher from './LocaleSwitcher';
import styled from '@emotion/styled';
import { ProfileMenu } from './ProfileManu/ProfileMenu';

const Root = styled.header`
  display: flex;
`;

interface Props {
  user?: User | null;
}
export const Navbar = ({ user }: Props) => {
  return (
    <Root>
      <Link href='/'>Store</Link>
      <LocaleSwitcher />
      <ProfileMenu initialUser={user} />
    </Root>
  );
};
