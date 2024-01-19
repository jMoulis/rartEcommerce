'use client';

import { useAuth } from './useAuth';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/src/types/DBTypes';
import { useAuthDispatch } from './useAuthDispatch';
import { onSigninAction } from '../actions';
import { useAuthSelector } from './useAuthSelector';
export const useUserSession: any = (initialUser: { user: User, profile: UserProfile } | null) => {
  const [user, setUser] = useState<User | null>(initialUser?.user ?? null);
  const authDispatch = useAuthDispatch();
  const profile: UserProfile = useAuthSelector((state) => state.profile);

  useEffect(() => {
    authDispatch(onSigninAction(initialUser?.profile ?? null));
  }, [initialUser?.profile]);

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
      if (user === undefined) {
        authDispatch(onSigninAction(null));
        return;
      }
      if (user?.email !== authUser?.email) {
        router.refresh();
        authDispatch(onSigninAction(null));
      }
    });
  }, [user]);

  return { user, profile };
};
