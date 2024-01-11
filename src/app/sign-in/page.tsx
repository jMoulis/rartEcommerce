import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebase-admin';
import SignIn from '../_components/sign-in/SignIn';

export default async function SignInPage() {
  if (await isUserAuthenticated()) redirect('/');
  return <SignIn />;
}
