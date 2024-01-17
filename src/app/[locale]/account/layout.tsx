import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import Navbar from '../../components/account/Navbar';

interface Props {
  children: React.ReactNode;
}
export default async function AccountSettingsLayout({ children }: Props) {
  if (!(await isUserAuthenticated())) {
    redirect('/sign-in?from=account');
  }
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
