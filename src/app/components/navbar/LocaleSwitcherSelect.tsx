'use client';

import { useRouter, usePathname } from '@/src/i18n/routing';
import { ChangeEvent, ReactNode, useTransition } from 'react';

interface Props {
  children: ReactNode;
  defaultValue: string;
}

export default function LocaleSwitcherSelect({
  children,
  defaultValue
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label htmlFor='language'>
      <select
        id='language'
        name='language'
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}>
        {children}
      </select>
    </label>
  );
}
