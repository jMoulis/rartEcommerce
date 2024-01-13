import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface Props {
  onClose: () => void;
}
export const LinksMenu = ({ onClose }: Props) => {
  const { signOut } = useAuth();
  const router = useRouter();
  const t = useTranslations();

  const handleSignOut = async () => {
    try {
      const payload = await signOut();
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
        <li>
          <Link onClick={onClose} href='/dashboard'>
            {t('Navbar.dashboard')}
          </Link>
        </li>
        <li>
          <Link onClick={onClose} href='/account-settings'>
            {t('Navbar.account')}
          </Link>
        </li>
        <li>
          <button onClick={handleSignOut}>{t('authCommons.signOut')}</button>
        </li>
      </ul>
    </nav>
  );
};
