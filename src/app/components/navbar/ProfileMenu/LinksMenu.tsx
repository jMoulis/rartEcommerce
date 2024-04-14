'use client';
import React from 'react';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../commons/Buttons/Button';
import styled from '@emotion/styled';

const ListItem = styled.li`
  padding: 5px 10px;
  margin: 0 5px;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
    background-color: var(--primary-color);
    color: #fff;
    &:last-child {
      background-color: transparent;
    }
  }
`;

interface Props {
  onClose: () => void;
}
export const LinksMenu = ({ onClose }: Props) => {
  const { onSignOut, isAdmin, loading } = useAuth();

  const t = useTranslations();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const payload = await onSignOut();

      if (payload.status) {
        router.push('/');
        onClose();
      } else if (payload.error) {
        throw Error(payload.error);
      }
    } catch (error) {}
  };
  return (
    <ul>
      {loading ? ' loading' : ''}
      {isAdmin ? (
        <ListItem>
          <Link onClick={onClose} href='/dashboard'>
            {t('Navbar.dashboard')}
          </Link>
        </ListItem>
      ) : null}
      <ListItem>
        <Link onClick={onClose} href='/account'>
          {t('Navbar.account')}
        </Link>
      </ListItem>
      <ListItem>
        <Button onClick={handleSignOut}>{t('authCommons.signOut')}</Button>
      </ListItem>
    </ul>
  );
};
