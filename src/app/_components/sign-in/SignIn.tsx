'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithGoogle } from '@/src/lib/firebase/auth';

export default function SignIn() {
  const router = useRouter();
  const prevRoute = useSearchParams().get('from');

  const handleSignIn = async () => {
    const isOk = await signInWithGoogle();
    if (isOk) router.push(prevRoute || '/');
  };

  return (
    <>
      <h1>Sing In Page</h1>
      <button onClick={handleSignIn}>Sign In with Google</button>
    </>
  );
}
