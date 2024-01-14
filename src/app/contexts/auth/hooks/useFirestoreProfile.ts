'use client';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { db, rootAuth } from '@/src/lib/firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const useFirestorProfile = () => {
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
  const onUpdateProfile = async (uid: string, update: Record<string, string>) => {
    try {
      if (!rootAuth.currentUser) return;
      const userRef = doc(db, ENUM_COLLECTIONS.PROFILES, rootAuth.currentUser.uid);
      await setDoc(userRef, update, { merge: true });
      return {
        status: true,
        error: null,
        code: 'profile-updated'
      };
    } catch (error) {
      return {
        status: true,
        error: null,
        code: 'profile-updated-error'
      };
    }
  };
  return {
    getAuthProfile,
    onUpdateProfile
  };
};
