'use client';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { db, rootAuth } from '@/src/lib/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onErrorMessage, onSuccessMessage } from '../../shared/response';
import { useTranslations } from 'next-intl';
import { UserProfile } from '@/src/types/DBTypes';

export const useFirestorProfile = () => {
  const t = useTranslations();
  const getAuthProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'profiles', uid); // Assuming 'profiles' is the collection name
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile: ', error);
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
  return {
    getAuthProfile,
    onUpdateProfile
  };
};
