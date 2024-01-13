import { db } from '@/src/lib/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';

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
  return {
    getAuthProfile
  };
};
