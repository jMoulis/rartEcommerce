'use client';

import { db, rootAuth } from '../../../lib/firebase/firebase';
import { doc, updateDoc } from 'firebase/firestore';
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

  return {
    onUpsertDoc,
  };
};
