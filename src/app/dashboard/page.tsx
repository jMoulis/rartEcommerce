import { redirect } from 'next/navigation';
import { isUserAuthenticated } from '@/src/lib/firebase/firebase-admin';
import Dashboard from '../components/dashboard/Dashboard';

export default async function DashboardPage() {
  if (!(await isUserAuthenticated())) redirect(`/sign-in?from=dashboard`);
  return <Dashboard />;
}
