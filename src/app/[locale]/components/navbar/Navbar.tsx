'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/lib/firebase/useAuth';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { useUserSession } from './useUserSession';
import { useToggle } from '../hooks/useToggle';
import { Dialog } from '@mui/material';
import { AuthForm } from '../auth/register/AuthForm';
import { ENUM_AUTH_FORM_VARIANT } from '../auth/register/enums';
import { useTranslations } from 'next-intl';
import LocaleSwitcher from './LocaleSwitcher';

interface Props {
  user?: User | null;
}
export const Navbar = ({ user: initialUser }: Props) => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const { open, onOpen, onClose } = useToggle();
  const user = useUserSession(initialUser);
  const router = useRouter();
  const [authFormVariant, setAuthFormVariant] =
    useState<ENUM_AUTH_FORM_VARIANT>(ENUM_AUTH_FORM_VARIANT.SIGNIN);
  const t = useTranslations();

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const payload = await signOut();
      setLoading(false);
      if (payload.status) {
        router.push('/');
      } else if (payload.error) {
        throw Error(payload.error);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    onOpen();
    setAuthFormVariant(ENUM_AUTH_FORM_VARIANT.REGISTER);
  };
  const handleSignIn = async () => {
    onOpen();
    setAuthFormVariant(ENUM_AUTH_FORM_VARIANT.SIGNIN);
  };

  return (
    <div>
      {loading ? (
        <div
          style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        />
      ) : null}
      <Link href='/'>Store</Link>
      <Link href='/dashboard'>Dashboard</Link>
      {user ? (
        <button onClick={handleSignOut}>{t('authCommons.signOut')}</button>
      ) : (
        <>
          <button onClick={handleSignIn}>{t('authCommons.signIn')}</button>
          <button onClick={handleRegister}>{t('authCommons.register')}</button>
        </>
      )}
      <LocaleSwitcher />
      <Dialog open={open} onClose={onClose} keepMounted={false}>
        <AuthForm variant={authFormVariant} onSuccess={onClose} />
      </Dialog>
    </div>
  );
};
