'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';

interface Props {
  onSuccess?: () => void;
}

export default function SignIn({ onSuccess }: Props) {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const prevRoute = useSearchParams().get('from');
  const handleSignIn = async () => {
    const isOk = await signInWithGoogle();
    onSuccess?.();
    if (isOk) router.push(prevRoute ?? '/');
  };

  return <button onClick={handleSignIn}>Sign In with Google</button>;
}
