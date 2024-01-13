import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebase-admin';
import { AuthForm } from '../components/auth/register/AuthForm';
import { Suspense } from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../components/auth/register/enums';

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect('/');
  return (
    <Suspense fallback={<span />}>
      <AuthForm variant={ENUM_AUTH_FORM_VARIANT.SIGNIN} />
    </Suspense>
  );
}
