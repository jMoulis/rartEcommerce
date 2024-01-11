'use client';

import { useEffect } from 'react';
import { useUserSession } from '../navbar/useUserSession';
import { useRouter, useSearchParams } from 'next/navigation';

export default function Dashboard() {
  const user = useUserSession();
  const router = useRouter();

  return <h1>Dashboard Page</h1>;
}
