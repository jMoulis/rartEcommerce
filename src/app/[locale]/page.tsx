import { unstable_setRequestLocale } from 'next-intl/server';

interface Props {
  params: {
    locale: string;
  };
}
export default async function HomePage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return <span>HEllo</span>;
}
