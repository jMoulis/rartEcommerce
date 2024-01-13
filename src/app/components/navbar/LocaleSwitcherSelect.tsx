'use client';

import { ChangeEvent, ReactNode, useTransition } from 'react';
import { useRouter, usePathname } from '@/src/navigation';

interface Props {
  children: ReactNode;
  defaultValue: string;
  label: string;
}

export default function LocaleSwitcherSelect({
  children,
  defaultValue,
  label,
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
    <label>
      <p>{label}</p>
      <select
        defaultValue={defaultValue}
        disabled={isPending}
        onChange={onSelectChange}>
        {children}
      </select>
    </label>
  );
}
