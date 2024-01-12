import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebase-admin';
import { AuthForm } from '../components/auth/register/AuthForm';
import { Suspense } from 'react';

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect('/');
  return (
    <Suspense fallback={<span />}>
      <AuthForm />
    </Suspense>
  );
}
