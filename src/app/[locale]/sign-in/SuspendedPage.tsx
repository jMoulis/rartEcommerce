'use client';

import { ENUM_AUTH_FORM_VARIANT } from '../../components/auth/enums';
import { AuthPage } from '../../components/auth/AuthPage';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserSession } from '../../contexts/auth/hooks/useUserSession';
import { useEffect } from 'react';

export default function SuspendedPage() {
  const router = useRouter();
  const prevRoute = useSearchParams().get('from');
  const { user } = useUserSession();

  useEffect(() => {
    if (user) {
      router.push(prevRoute ?? '/');
    }
  }, [user]);

  const handleSuccess = () => {
    router.push(prevRoute ?? '/');
  };

  return (
    <AuthPage
      variant={ENUM_AUTH_FORM_VARIANT.SIGNIN}
      onSuccess={handleSuccess}
    />
  );
}
