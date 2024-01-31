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
  QueryConstraint,
  where,
  FirestoreError,
} from 'firebase/firestore';
import { ENUM_COLLECTIONS } from '../../../lib/firebase/enums';
import { onErrorMessage, onSuccessMessage } from '../shared/response';

export const useFirestore = () => {
  const onFindAllRealtime = (
    collectionName: ENUM_COLLECTIONS,
    onResult: (data: any[]) => void,
    onError: (error: Error) => void,
    queryObject = {}
  ) => {
    const productsRef = firestoreCollection(db, collectionName);
    const queryConstraints: QueryConstraint[] = [];

    for (const [field, value] of Object.entries(queryObject)) {
      queryConstraints.push(where(field, '==', value));
    }

    return onSnapshot(
      query(productsRef, ...queryConstraints),
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
      return onSuccessMessage('create', undefined, {
        _id: docRef.id,
        ...fields,
      });
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
      return onSuccessMessage('create', undefined, { _id: docRef.id });
    } catch (error) {
      return onErrorMessage(error);
    }
  };

  const onDeleteDocument = async (collection: ENUM_COLLECTIONS, id: string) => {
    try {
      const docRef = doc(db, collection, id);
      await deleteDoc(docRef);

      return onSuccessMessage('deleted', undefined, { _id: docRef.id });
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
      return onSuccessMessage('deleted', undefined, products);
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
          _id: docSnap.id,
        });
      } else {
        return onErrorMessage({ code: 'not-found' });
      }
    } catch (error) {
      return onErrorMessage(error);
    }
  };

  const onFetchDocsByIdsArray = async (
    documentRefIds: string[],
    collection: ENUM_COLLECTIONS
  ) => {
    const payload = [];
    try {
      for (const refId of documentRefIds) {
        const templateRef = doc(db, collection, refId);
        const templateSnap = await getDoc(templateRef);

        if (templateSnap.exists()) {
          payload.push({ ...templateSnap.data(), _id: templateSnap.id });
        }
      }
      return onSuccessMessage('fetch', undefined, payload);
    } catch (error) {
      return onErrorMessage(error);
    }
  };

  const onFetchDocsByIdsArrayWithSnapshot = (
    documentRefIds: string[],
    collection: ENUM_COLLECTIONS,
    onChange: (payload: any[]) => void,
    onError: (error: Error) => void
  ) => {
    const payload: any = [];
    const unsubscribes: any[] = [];

    try {
      documentRefIds.forEach((refId) => {
        const templateRef = doc(db, collection, refId);

        const unsubscribe = onSnapshot(templateRef, (docSnap) => {
          if (docSnap.exists()) {
            const index = payload.findIndex(
              (item: any) => item._id === docSnap.id
            );
            const docData = { ...docSnap.data(), _id: docSnap.id };

            if (index === -1) {
              payload.push(docData);
            } else {
              payload[index] = docData;
            }
            onChange([...payload]);
          }
        });
        unsubscribes.push(unsubscribe);
      });
    } catch (error: any) {
      onError(error);
    }
    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  };

  const onFindSingleRealtime = (
    collectionName: ENUM_COLLECTIONS,
    docId: string,
    onResult: (data: any) => void,
    onError: (error: FirestoreError) => void
  ) => {
    const docRef = doc(db, collectionName, docId);

    return onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = {
            ...docSnapshot.data(),
            _id: docSnapshot.id,
          };
          onResult(data);
        } else {
          // Handle the case where the document does not exist
          onResult(null);
        }
      },
      (error) => {
        onError(error);
      }
    );
  };
  return {
    onFindAllRealtime,
    findDocumentById,
    findAllOnce,
    onDeleteDocument,
    onUpdateDocument,
    onCreateDocument,
    onFetchDocsByIdsArray,
    onFetchDocsByIdsArrayWithSnapshot,
    onFindSingleRealtime,
  };
};
