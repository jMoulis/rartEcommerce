'use client';

import { db } from '../../../lib/firebase/firebase';
import {
  collection as firestoreCollection,
  doc,
  onSnapshot,
  query,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { ENUM_COLLECTIONS } from '../../../lib/firebase/enums';
import { onErrorMessage, onSuccessMessage } from '../shared/response';

export const useFirestore = () => {
  const onFindAllRealtime = (
    collectionName: ENUM_COLLECTIONS,
    onResult: (data: any[]) => void,
    onError: (error: Error) => void
  ) => {
    const productsRef = firestoreCollection(db, collectionName);

    return onSnapshot(
      query(productsRef),
      (querySnapshot) => {
        const products = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          _id: doc.id,
        }));
        onResult(products);
      },
      (error) => {
        onError(error);
      }
    );
  };

  const onCreateDocument = async (
    fields: Record<string, any>,
    collection: ENUM_COLLECTIONS
  ) => {
    try {
      const docRef = doc(firestoreCollection(db, collection));
      await setDoc(docRef, fields, { merge: true });
      return onSuccessMessage('create', undefined, { id: docRef.id });
    } catch (error) {
      return onErrorMessage(error);
    }
  };

  const onUpdateDocument = async (
    fields: Record<string, any>,
    collection: ENUM_COLLECTIONS,
    id: string
  ) => {
    try {
      const docRef = doc(db, collection, id);
      await setDoc(docRef, fields, { merge: true });
      return onSuccessMessage('create', undefined, { id: docRef.id });
    } catch (error) {
      return onErrorMessage(error);
    }
  };
  const onDeleteDocument = async (collection: ENUM_COLLECTIONS, id: string) => {
    try {
      const docRef = doc(db, collection, id);
      await deleteDoc(docRef);

      return onSuccessMessage('deleted', undefined, { id: docRef.id });
    } catch (error) {
      return onErrorMessage(error);
    }
  };
  const findAllOnce = async (collection: ENUM_COLLECTIONS) => {
    try {
      const productsRef = firestoreCollection(db, collection);
      const querySnapshot = await getDocs(productsRef);
      const products = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        _id: doc.id,
      }));
      return products;
    } catch (error) {
      return onErrorMessage(error);
    }
  };

  const findDocumentById = async (
    docId: string,
    collection: ENUM_COLLECTIONS
  ) => {
    try {
      const docRef = doc(db, collection, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return onSuccessMessage('fetch', undefined, {
          ...docSnap.data(),
          id: docSnap.id,
        });
      } else {
        return onErrorMessage({ code: 'not-found' });
      }
    } catch (error) {
      return onErrorMessage(error);
    }
  };
  return {
    onFindAllRealtime,
    findDocumentById,
    findAllOnce,
    onDeleteDocument,
    onUpdateDocument,
    onCreateDocument,
  };
};
