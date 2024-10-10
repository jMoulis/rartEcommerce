import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import Navbar from '../../components/account/Navbar';
import { Page } from '../../components/client/commons/layout/Page';

interface Props {
  children: React.ReactNode;
}
export default async function AccountSettingsLayout({ children }: Props) {
  if (!(await isUserAuthenticated())) {
    redirect('/sign-in?from=account');
  }
  return (
    <Page
      style={{
        paddingTop: '100px',
      }}>
      <Navbar />
      {children}
    </Page>
  );
}
