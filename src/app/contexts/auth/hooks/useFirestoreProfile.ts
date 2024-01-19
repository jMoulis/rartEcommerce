'use client';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { db, rootAuth } from '@/src/lib/firebase/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onErrorMessage, onSuccessMessage } from '../../shared/response';
import { useTranslations } from 'next-intl';
import { UserProfile } from '@/src/types/DBTypes';

export const useFirestorProfile = () => {
  const t = useTranslations();
  const getAuthProfile = async (uid: string) => {
    // eslint-disable-next-line no-useless-catch
    try {
      const docRef = doc(db, 'profiles', uid); // Assuming 'profiles' is the collection name
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
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
