import { onErrorMessage, onSuccessMessage } from '@/src/app/contexts/shared/response';
import { ENUM_COLLECTIONS } from '../enums';
import { db } from '../firebase';
import { adminDB, auth } from '../firebaseAuth/firebase-admin';
import { doc, setDoc, collection as firestoreCollection, getDoc, getDocs, deleteDoc, QueryConstraint, where, query, orderBy } from 'firebase/firestore';
import { WhereFilterOp } from 'firebase-admin/firestore';
import { IContactInformations, UserProfile } from '@/src/types/DBTypes';
import { ENUM_ROLES } from '@/src/app/contexts/auth/enums';

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
export const onAdminCreateDocument = async (
  fields: Record<string, any>,
  collection: ENUM_COLLECTIONS,
  documentId?: string
) => {
  try {
    const collectionRef = adminDB.collection(collection);
    let docRef;

    if (documentId) {
      docRef = collectionRef.doc(documentId);
      const docSnapshot = await docRef.get();

      if (docSnapshot.exists) {
        await docRef.update(fields);
      } else {
        throw Error(`Document with ID ${documentId} does not exist.`);
      }
    } else {
      docRef = await collectionRef.add(fields);
    }
    return onSuccessMessage('create', undefined, { _id: docRef.id });
  } catch (error) {
    throw Error(`Error: ${collection} creation/update`);
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
export const onAdminUpdateDocument = async (
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
export const findAll = async (collection: ENUM_COLLECTIONS, ordered?: string[]) => {
  try {
    const productsRef = firestoreCollection(db, collection);
    const queryConstraints: QueryConstraint[] = [];

    if (ordered) {
      queryConstraints.push(orderBy(ordered[0], ordered[1] as any));
    }
    const q = query(productsRef, ...queryConstraints);

    const querySnapshot = await getDocs(q);
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
export const getAdminDocument = async (
  docId: string,
  collection: ENUM_COLLECTIONS
) => {
  try {
    const docRef = adminDB.collection(collection).doc(docId);
    const docSnap = await docRef.get();
    if (docSnap.id) {
      return onSuccessMessage('fetch', undefined, { ...docSnap.data(), _id: docSnap.id });
    } else {
      return onErrorMessage({ code: 'not-found' });
    }
  } catch (error) {
    throw new Error(`Error: Fetch ${collection} - ${docId}`);
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

export const onAdminCreateAccount = async (email: string, password: string, contact: IContactInformations) => {
  try {
    await auth.createUser({
      email,
      password
    });
    const profileRef = adminDB.collection(ENUM_COLLECTIONS.PROFILES);
    const customerRef = adminDB.collection(ENUM_COLLECTIONS.CUSTOMERS);
    const profile: UserProfile = {
      email,
      firstname: contact.firstname,
      lastname: contact.lastname,
      addresses: contact.address ? [contact.address] : [],
      verified: false,
      roles: [ENUM_ROLES.VISITOR],
      avatar: ''
    };
    const createdProfile = await profileRef.add(profile);
    const customer = await customerRef.add({ ...profile, profileId: createdProfile.id });
    return customer.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
