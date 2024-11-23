import { notFound } from 'next/navigation';
import {
  getCurrentUser
  // isUserAuthenticated
} from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { ENUM_ROLES } from '../../contexts/auth/enums';
import Menu from '../../components/dashboard/Menu';
import { SectionPage } from '../../components/commons/Layouts/SectionPage';
import { DashboardPageLayout } from '../../components/commons/Layouts/DashboardPageLayout';
import { BackButton } from '../../components/dashboard/BackButton';

interface Props {
  children: React.ReactNode;
}
export default async function DashboardLayout({ children }: Props) {
  const current = await getCurrentUser();

  // if (!(await isUserAuthenticated())) redirect('/sign-in?from=dashboard');

  if (!current?.profile?.roles?.includes(ENUM_ROLES.ADMIN)) {
    return notFound();
  }

  return (
    <DashboardPageLayout>
      <BackButton />
      <Menu />
      <SectionPage>{children}</SectionPage>
    </DashboardPageLayout>
  );
}
