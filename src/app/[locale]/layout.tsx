import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/src/intl/config';
import { notFound } from 'next/navigation';
import NextIntlProvider from '../contexts/NextIntlProvider';
import { Navbar } from '../components/navbar/Navbar';
import { AuthProvider } from '../contexts/auth/AuthContext';
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { getCurrentUser } from '@/src/lib/firebase/firebaseAuth/firebase-admin';
import { CartProvider } from '../contexts/cart/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import helveticaCondensed from '../style/fonts/helveticaCondensed';

config.autoAddCss = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

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
  const { locale } = await params;
  unstable_setRequestLocale(locale);

  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  await getCurrentUser();

  return (
    <html lang={locale} className={`${helveticaCondensed.className}`}>
      <body>
        <AppRouterCacheProvider>
          <NextIntlProvider
            locale={locale}
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
          </NextIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
