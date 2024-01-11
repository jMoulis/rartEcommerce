import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import './globals.css';
import { Navbar } from './components/navbar/Navbar';
import { getCurrentUser } from '../lib/firebase/firebase-admin';

export const metadata: Metadata = {
  title: 'Rartcreation',
  description: 'Le monde de la création',
};

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <html lang='fr'>
      <body>
        <AppRouterCacheProvider>
          <Navbar user={currentUser} />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
