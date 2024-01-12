'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from '@/src/lib/firebase/auth';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { useUserSession } from './useUserSession';
import { useToggle } from '../hooks/useToggle';
import { Dialog } from '@mui/material';
import { AuthForm } from '../auth/register/AuthForm';

type Props = {
  user?: User | null;
};
export const Navbar = ({ user: initialUser }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { open, onOpen, onClose } = useToggle();
  const user = useUserSession(initialUser);
  const router = useRouter();
  const [authFormVariant, setAuthFormVariant] = useState<'register' | 'signIn'>(
    'signIn'
  );

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const payload = await signOut();
      setLoading(false);
      if (payload.status) {
        return router.push('/');
      }
      throw Error(payload.error);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    onOpen();
    setAuthFormVariant('register');
  };
  const handleSignIn = async () => {
    onOpen();
    setAuthFormVariant('signIn');
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
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <>
          <button onClick={handleSignIn}>Sign in</button>
          <button onClick={handleRegister}>Register</button>
        </>
      )}
      <Dialog open={open} onClose={onClose}>
        <div>
          <AuthForm variant={authFormVariant} onSuccess={onClose} />
        </div>
      </Dialog>
    </div>
  );
};
