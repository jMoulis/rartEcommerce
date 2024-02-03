import { onErrorMessage, onSuccessMessage } from '@/src/app/contexts/shared/response';
import { ENUM_COLLECTIONS } from '../enums';
import { db } from '../firebase';
import { adminDB } from '../firebaseAuth/firebase-admin';
import { doc, setDoc, collection as firestoreCollection, getDoc, getDocs, deleteDoc, QueryConstraint, where, query } from 'firebase/firestore';
import { WhereFilterOp } from 'firebase-admin/firestore';

export const onCreateDocument = async (
  fields: Record<string, any>,
  collection: ENUM_COLLECTIONS
) => {
  try {
    const docRef = doc(firestoreCollection(db, collection));
    await setDoc(docRef, fields, { merge: true });
    return onSuccessMessage('create', undefined, { _id: docRef.id });
  } catch (error) {
    return onErrorMessage(error);
  }
};

export const onUpdateDocument = async (
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
export const onRootUpdateDocument = async (
  updates: Record<string, any>,
  collection: ENUM_COLLECTIONS,
  id: string
) => {
  try {
    const docRef = adminDB.collection(collection).doc(id);
    await docRef.update(updates);
    return onSuccessMessage('update', undefined, { _id: docRef.id });
  } catch (error: any) {
    return onErrorMessage(error);
  }
};
export const onDeleteDocument = async (
  collection: ENUM_COLLECTIONS,
  id: string
) => {
  try {
    const docRef = doc(db, collection, id);
    await deleteDoc(docRef);

    return onSuccessMessage('deleted', undefined, { _id: docRef.id });
  } catch (error) {
    return onErrorMessage(error);
  }
};
export const findAll = async (collection: ENUM_COLLECTIONS) => {
  try {
    const productsRef = firestoreCollection(db, collection);
    const querySnapshot = await getDocs(productsRef);
    const products = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      _id: doc.id,
    }));
    return products;
  } catch (error) {
    return onErrorMessage(error);
  }
};
export const findByQuery = async (collection: ENUM_COLLECTIONS, queryObject: any) => {
  try {
    const productsRef = firestoreCollection(db, collection);
    const queryConstraints: QueryConstraint[] = [];

    for (const [field, value] of Object.entries(queryObject)) {
      queryConstraints.push(where(field, '==', value));
    }

    const firebaseQuery = query(productsRef, ...queryConstraints);

    const querySnapshot = await getDocs(firebaseQuery);

    const products = querySnapshot.docs.map(doc => ({
      ...doc.data() || {},
      _id: doc.id,
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
      return onSuccessMessage('fetch', undefined, { ...docSnap.data(), _id: docSnap.id });
    } else {
      return onErrorMessage({ code: 'not-found' });
    }
  } catch (error) {
    return onErrorMessage(error);
  }
};

export const onRootFindByQuery = async (collection: ENUM_COLLECTIONS, queryObject: any) => {
  try {
    const collectionRef = adminDB.collection(collection);
    let query: any = collectionRef; // Start with the collection reference

    for (const [field, value] of Object.entries(queryObject)) {
      query = query.where(field, '==' as WhereFilterOp, value);
    }

    const querySnapshot = await query.get();

    const results = querySnapshot.docs.map((doc: any) => ({
      ...doc.data(),
      _id: doc.id,
    }));

    return results[0];
  } catch (error) {
    return onErrorMessage(error);
  }
};
