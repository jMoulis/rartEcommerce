import type { Metadata } from 'next';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import './globals.css';
import { Navbar } from './components/navbar/Navbar';
import { getCurrentUser } from '../../lib/firebase/firebase-admin';

import { i18n, type Locale } from '../../../i18n-config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const metadata: Metadata = {
  title: 'Rartcreation',
  description: 'Le monde de la création',
};

type Props = {
  children: React.ReactNode;
  params: { lang: Locale };
};

export default async function RootLayout({ children, params }: Props) {
  const currentUser = await getCurrentUser();
  return (
    <html lang={params.lang}>
      <body>
        <AppRouterCacheProvider>
          <Navbar user={currentUser} />
          {children}
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
