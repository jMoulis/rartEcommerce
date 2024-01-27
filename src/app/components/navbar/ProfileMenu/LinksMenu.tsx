'use client';
import React from 'react';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../commons/Buttons/Button';

interface Props {
  onClose: () => void;
}
export const LinksMenu = ({ onClose }: Props) => {
  const { onSignOut, isAdmin } = useAuth();

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
    <nav>
      <ul>
        {isAdmin ? (
          <li>
            <Link onClick={onClose} href='/dashboard'>
              {t('Navbar.dashboard')}
            </Link>
          </li>
        ) : null}
        <li>
          <Link onClick={onClose} href='/account'>
            {t('Navbar.account')}
          </Link>
        </li>
        <li>
          <Button onClick={handleSignOut}>{t('authCommons.signOut')}</Button>
        </li>
      </ul>
    </nav>
  );
};
