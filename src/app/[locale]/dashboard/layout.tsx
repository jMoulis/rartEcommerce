import { notFound, redirect } from 'next/navigation';
import {
  getCurrentUser,
  isUserAuthenticated,
} from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { ENUM_ROLES } from '../../contexts/auth/enums';
import Menu from '../../components/dashboard/Menu';
import './style.css';

interface Props {
  children: React.ReactNode;
}
export default async function DashboardLayout({ children }: Props) {
  const current = await getCurrentUser();

  if (!(await isUserAuthenticated())) redirect('/sign-in?from=dashboard');

  if (!current?.profile?.roles?.includes(ENUM_ROLES.ADMIN)) {
    return notFound();
  }

  return (
    <main className='page dashboard-page'>
      <Menu />
      <section className='section-page'>{children}</section>
    </main>
  );
}
