'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithGoogle, signOut } from '@/src/lib/firebase/auth';
import Link from 'next/link';
import { User } from 'firebase/auth';
import { useUserSession } from './useUserSession';

type Props = {
  user?: User | null;
};
export const Navbar = ({ user: initialUser }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const user = useUserSession(initialUser);
  const router = useRouter();
  const prevRoute = useSearchParams().get('from');

  const handleSignOut = async () => {
    try {
      setLoading(true);
      const isOk = await signOut();
      setLoading(false);
      if (isOk) router.push('/');
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      setLoading(true);
      const isOk = await signInWithGoogle();
      setLoading(false);
      if (isOk) router.push(prevRoute || '/');
    } catch (error) {
      setLoading(false);
    }
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
          <button onClick={handleSignIn}>Register</button>
        </>
      )}
    </div>
  );
};
