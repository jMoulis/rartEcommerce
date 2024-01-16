'use server';

import { onErrorMessage, onSuccessMessage } from '@/src/app/contexts/shared/response';
import { ENUM_COLLECTIONS } from '../enums';
import { db } from '../firebase';
import { doc, setDoc, collection as firestoreCollection, getDoc, getDocs } from 'firebase/firestore';

export const onCreateDocument = async (
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
export const findAll = async (collection: ENUM_COLLECTIONS) => {
  try {
    const productsRef = firestoreCollection(db, collection);
    const querySnapshot = await getDocs(productsRef);
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return products;
  } catch (error) {
    return onErrorMessage(error);
  }
};
export const getDocument = async (
  docId: string,
  collection: ENUM_COLLECTIONS
) => {
  try {
    const docRef = doc(db, collection, docId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return onErrorMessage({ code: 'not-found' });
    }
  } catch (error) {
    return onErrorMessage(error);
  }
};
