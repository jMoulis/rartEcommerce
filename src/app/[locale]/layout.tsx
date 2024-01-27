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
import { EB_Garamond } from 'next/font/google';

const garamond = EB_Garamond({
  subsets: ['latin'],
  display: 'block',
  weight: ['400', '500', '600', '700', '800'],
  fallback: ['serif'],
});

config.autoAddCss = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'Metadata' });
  return {
    title: t('title'),
  };
}

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({ children, params }: Props) {
  unstable_setRequestLocale(params.locale);

  let messages;
  try {
    messages = (await import(`../../../messages/${params.locale}.json`))
      .default;
  } catch (error) {
    notFound();
  }
  const current = await getCurrentUser();

  return (
    <html lang={params.locale} className={garamond.className}>
      <body>
        <AppRouterCacheProvider>
          <NextIntlProvider
            locale={params.locale}
            messages={messages}
            timeZone='Europe/Paris'
            now={new Date()}>
            <AuthProvider>
              <Navbar current={current} />
              {children}
            </AuthProvider>
          </NextIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
