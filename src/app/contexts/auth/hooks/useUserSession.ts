'use client';

import { useAuth } from './useAuth';
import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/src/types/DBTypes';
import { useAuthDispatch } from './useAuthDispatch';
import { onSigninAction } from '../actions';
import { useAuthSelector } from './useAuthSelector';
import { useFirestoreProfile } from './useFirestoreProfile';

export const useUserSession: any = (initialUser: { user: User, profile: UserProfile } | null) => {
  const [user, setUser] = useState<User | null>(initialUser?.user ?? null);
  const authDispatch = useAuthDispatch();
  const profile: UserProfile = useAuthSelector((state) => state.profile);
  const { getAuthProfile } = useFirestoreProfile();

  useEffect(() => {
    // authDispatch(onSigninAction(initialUser?.profile ?? null));
  }, [initialUser?.profile]);

  const { onAuthStateChanged } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      setUser(authUser);
    });
    return () => { unsubscribe(); };
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: User | null) => {
      if (authUser) {
        getAuthProfile(authUser.uid).then((p) => {
          authDispatch(onSigninAction(p));
        });
      }
      if (user === undefined) {
        authDispatch(onSigninAction(null));
        return;
      }
      if (user?.email !== authUser?.email) {
        // router.refresh();
        authDispatch(onSigninAction(null));
      }
    });
  }, [user]);

  return { user, profile };
};
