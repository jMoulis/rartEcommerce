'use client';

import { useAuth } from './useAuth';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFirestorProfile } from './useFirestoreProfile';
import { UserProfile } from '@/src/types/DBTypes';
import { useAuthDispatch } from './useAuthDispatch';
import { onSigninAction } from '../actions';
import { useAuthSelector } from './useAuthSelector';

export const useUserSession: any = () => {
  const [user, setUser] = useState<User | null>(null);
  const authDispatch = useAuthDispatch();

  const profile: UserProfile = useAuthSelector((state) => state.profile);

  const { getAuthProfile } = useFirestorProfile();

  const { onAuthStateChanged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      setUser(authUser);
      if (authUser) {
        console.log('TEST');
        getAuthProfile(authUser.uid).then((payload) => {
          authDispatch(onSigninAction(payload as UserProfile));
        }).catch((error) => console.error(error));
      } else {
        authDispatch(onSigninAction(null));
        setUser(null);
      }
    });
    return () => { unsubscribe(); };
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser: User | null) => {
      if (user === undefined) {
        authDispatch(onSigninAction(null));
        return;
      };
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  return { user, profile };
};
