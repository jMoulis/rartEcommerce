'use client';

import { useAuth } from './useAuth';
import { User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFirestorProfile } from './useFirestoreProfile';
import { UserProfile } from '@/src/types/DBTypes';

export const useUserSession = (initialUser?: User | null) => {
  const [user, setUser] = useState(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { getAuthProfile } = useFirestorProfile();

  const { onAuthStateChanged } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser: User | null) => {
      setUser(authUser);
      if (authUser) {
        getAuthProfile(authUser.uid).then((payload) => setProfile(payload as UserProfile)).catch((error) => console.error(error));
      } else {
        setProfile(null); // Reset profile data if user is logged out
        setUser(null);
      }
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

  return { user, profile };
};
