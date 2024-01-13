import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { Suspense } from 'react';
import { ENUM_AUTH_FORM_VARIANT } from '../../components/auth/enums';
import { AuthPage } from '../../components/auth/AuthPage';

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect('/');
  return (
    <Suspense fallback={<span />}>
      <AuthPage variant={ENUM_AUTH_FORM_VARIANT.SIGNIN} />
    </Suspense>
  );
}
