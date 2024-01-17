'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../contexts/auth/hooks/useAuth';

interface Props {
  onSuccess?: () => void;
}

export default function SignIn({ onSuccess }: Props) {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const handleSignIn = async () => {
    const payload = await signInWithGoogle();
    onSuccess?.();
    if (payload.status) {
      router.refresh();
    }
  };

  return <button onClick={handleSignIn}>Sign In with Google</button>;
}
