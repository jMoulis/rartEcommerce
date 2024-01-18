'use client';

import { db, rootAuth } from '../../../lib/firebase/firebase';
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from 'firebase/firestore';
import { ENUM_COLLECTIONS } from '../../../lib/firebase/enums';
import { onErrorMessage, onSuccessMessage } from '../shared/response';
import { useTranslations } from 'next-intl';

export const useFirestore = () => {
  const t = useTranslations();

  const onUpsertDoc = async (
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

  const onFindAllRealtime = (
    collectionName: ENUM_COLLECTIONS,
    onResult: (data: any[]) => void,
    onError: (error: Error) => void
  ) => {
    const productsRef = collection(db, collectionName);

    return onSnapshot(
      query(productsRef),
      (querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        onResult(products);
      },
      (error) => {
        onError(error);
      }
    );
  };
  return {
    onUpsertDoc,
    onFindAllRealtime,
  };
};
