import { getDictionary } from '@/get-dictionary';
import { Locale } from '../../../i18n-config';
import Link from 'next/link';

type Props = {
  params: {
    lang: Locale;
  };
};
export default async function HomePage({ params: { lang } }: Props) {
  const dictionary = await getDictionary(lang);

  return <span>{dictionary['server-component'].welcome}</span>;
}
