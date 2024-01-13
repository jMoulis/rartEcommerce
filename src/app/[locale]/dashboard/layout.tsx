import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebaseAuth/firebase-admin';

interface Props {
  children: React.ReactNode;
}
export default async function DashboardLayout({ children }: Props) {
  if (!(await isUserAuthenticated())) redirect('/sign-in?from=dashboard');
  return <>{children}</>;
}
