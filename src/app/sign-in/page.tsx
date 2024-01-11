import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebase-admin';
import { AuthForm } from '../components/auth/register/AuthForm';

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect('/');
  return (
    <>
      <AuthForm />
    </>
  );
}
