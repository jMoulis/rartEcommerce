import { redirect } from 'next/navigation';
import { defaultLocale } from '../intl/config';

export default function RootPage() {
  redirect(defaultLocale);
}
