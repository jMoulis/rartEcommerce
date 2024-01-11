import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from './_components/navbar/Navbar';
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
        <Navbar user={currentUser} />
        {children}
      </body>
    </html>
  );
}
