'use client';

import { useAuth } from '@/src/lib/firebase/useAuth';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useUserSession = (initialUser?: User | null) => {
  const [user, setUser] = useState(initialUser);
  const { onAuthStateChanged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      setUser(authUser);
    });

    return () => { unsubscribe(); };
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: User | null) => {
      if (user === undefined) return;
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  return user;
};
