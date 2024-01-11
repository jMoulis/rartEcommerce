'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithGoogle } from '@/src/lib/firebase/auth';

type Props = {
  onSuccess?: () => void;
};

export default function SignIn({ onSuccess }: Props) {
  const router = useRouter();
  const prevRoute = useSearchParams().get('from');

  const handleSignIn = async () => {
    const isOk = await signInWithGoogle();
    onSuccess?.();
    if (isOk) router.push(prevRoute || '/');
  };

  return (
    <>
      <button onClick={handleSignIn}>Sign In with Google</button>
    </>
  );
}
