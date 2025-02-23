'use client';

import { useAuth } from './useAuth';
import { Unsubscribe, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { UserProfile } from '@/src/types/DBTypes';
import { useAuthDispatch } from './useAuthDispatch';
import { onSigninAction } from '../actions';
import { useAuthSelector } from './useAuthSelector';
import { useFirestoreProfile } from './useFirestoreProfile';

export const useUserSession: () => { user: User | null, profile: UserProfile | null } = () => {
  const [user, setUser] = useState<User | null>(null);
  const authDispatch = useAuthDispatch();
  const profile: UserProfile = useAuthSelector((state) => state.profile);
  const { getAuthProfile } = useFirestoreProfile();

  const { onAuthStateChanged } = useAuth();

  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged((authUser: User | null) => {
  //     setUser(authUser);
  //   });
  //   return () => { unsubscribe(); };
  // }, []);

  // useEffect(() => {
  //   let unsubscribe: Unsubscribe;
  //   if (user) {
  //     getAuthProfile(user.uid, (p) => authDispatch(onSigninAction(p))).then((unsub) => {
  //       unsubscribe = unsub;
  //     });
  //   }
  //   return () => {
  //     if (unsubscribe) {
  //       unsubscribe();
  //     }
  //   };
  // }, [user]);

  useEffect(() => {
    let unsubscribe: Unsubscribe;
    onAuthStateChanged((authUser: User | null) => {
      if (authUser) {
        setUser(authUser);
        getAuthProfile(authUser.uid, (p) => authDispatch(onSigninAction(p))).then((unsub) => {
          unsubscribe = unsub;
        });
      }
      if (user === undefined) {
        setUser(null);
        authDispatch(onSigninAction(null));
        return;
      }
      if (user?.email !== authUser?.email) {
        authDispatch(onSigninAction(null));
      }
    });
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  return { user, profile };
};
