import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import Link from 'next/link';

interface Props {
  children: React.ReactNode;
}
export default async function AccountSettingsLayout({ children }: Props) {
  if (!(await isUserAuthenticated())) {
    redirect('/sign-in?from=account-settings');
  }
  return (
    <>
      <h1>Compte</h1>
      {children}
    </>
  );
}
