import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { getMessages, getTranslations } from 'next-intl/server';
import { Navbar } from '../components/navbar/Navbar';
import { AuthProvider } from '../contexts/auth/AuthContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { getCurrentUser } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { CartProvider } from '../contexts/cart/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import helveticaCondensed from '../style/fonts/helveticaCondensed';
import { NextIntlClientProvider } from 'next-intl';

config.autoAddCss = false;

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title')
  };
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: Props) {
  const messages = (await getMessages()) as any;

  await getCurrentUser();

  return (
    <html lang='fr' className={`${helveticaCondensed.className}`}>
      <body>
        <AppRouterCacheProvider>
          <NextIntlClientProvider
            messages={messages}
            timeZone='Europe/Paris'
            now={new Date()}>
            <AuthProvider>
              <ToastContainer />
              <CartProvider>
                <Navbar />
                {children}
              </CartProvider>
            </AuthProvider>
          </NextIntlClientProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
