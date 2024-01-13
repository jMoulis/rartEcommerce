import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';

import { getCurrentUser } from '../../lib/firebase/firebaseAuth/firebase-admin';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { locales } from '@/src/intl/config';

import { notFound } from 'next/navigation';
import NextIntlProvider from '../contexts/NextIntlProvider';
import { Navbar } from '../components/navbar/Navbar';

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
  const currentUser = await getCurrentUser();
  return (
    <html lang={params.locale}>
      <body>
        <AppRouterCacheProvider>
          <NextIntlProvider
            locale={params.locale}
            messages={messages}
            timeZone='Europe/Paris'
            now={new Date()}>
            <Navbar user={currentUser} />
            {children}
          </NextIntlProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
