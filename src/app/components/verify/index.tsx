'use client';
import { Page } from '@/src/app/components/client/commons/layout/Page';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { APIResponse } from '@/src/types/types';

export default function Verify() {
  const params = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const hasToken = useMemo(() => {
    return Boolean(params.get('token'));
  }, [params]);

  const sendCheckRequest = async () => {
    const token = params.get('token');
    const email = params.get('email');

    const payload = {
      method: 'POST',
      body: JSON.stringify({ token, email }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
    try {
      const rawResponse = await fetch('/api/auth/verify', payload);
      const response = (await rawResponse.json()) as unknown as APIResponse;
      if (response.success) {
        // setTimeout(() => {
        // router.replace('/sign-in');
        // }, 3000);
      } else {
        throw Error(response.error);
      }
    } catch (error: any) {
      setErr(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasToken) {
      router.replace('/sign-in');
    } else {
      sendCheckRequest();
    }
  }, [hasToken]);

  if (!hasToken) {
    return notFound();
  }
  return (
    <Page>
      {!hasToken}
      {loading ? <span>Checking</span> : null}
      {err ? <span>{err}</span> : null}
    </Page>
  );
}
