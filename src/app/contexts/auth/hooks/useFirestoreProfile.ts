'use client';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { db, rootAuth } from '@/src/lib/firebase/firebase';
import { doc, onSnapshot, setDoc, updateDoc, Unsubscribe } from 'firebase/firestore';
import { onErrorMessage, onSuccessMessage } from '../../shared/response';
import { useTranslations } from 'next-intl';
import { UserProfile } from '@/src/types/DBTypes';

export const useFirestoreProfile = () => {
  const t = useTranslations();
  const getAuthProfile = async (uid: string, callback: (profile: UserProfile) => void) => {
    const docRef = doc(db, ENUM_COLLECTIONS.PROFILES, uid);
    const unsubscribe: Unsubscribe | null = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        callback({ ...docSnap.data(), _id: docSnap.id } as unknown as UserProfile);
      }
    });
    return unsubscribe;
  };
  const onUpdateProfile = async (update: UserProfile) => {
    try {
      if (!rootAuth.currentUser) return;
      const userRef = doc(db, ENUM_COLLECTIONS.PROFILES, rootAuth.currentUser.uid);
      await setDoc(userRef, update, { merge: true });
      return onSuccessMessage('profile-updated', t);
    } catch (error) {
      return onErrorMessage(error);
    }
  };
  const onUpdateAddress = async (
    fields: Record<string, any>,
    collection: ENUM_COLLECTIONS
  ) => {
    if (!rootAuth.currentUser) {
      return onErrorMessage(
        {
          code: 'auth/user-not-found',
        },
        t
      );
    }
    const profileRef = doc(db, collection, rootAuth.currentUser.uid);
    try {
      await updateDoc(profileRef, fields);
      return onSuccessMessage('edit', t);
    } catch (error) {
      return onErrorMessage(error, t);
    }
  };

  return {
    getAuthProfile,
    onUpdateProfile,
    onUpdateAddress
  };
};
