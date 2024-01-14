import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebaseAuth/firebase-admin';

interface Props {
  children: React.ReactNode;
}
export default async function AccountSettingsLayout({ children }: Props) {
  console.log(await isUserAuthenticated());
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
