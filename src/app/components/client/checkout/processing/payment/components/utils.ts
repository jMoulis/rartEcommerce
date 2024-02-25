import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { db } from '@/src/lib/firebase/firebase';
import { ICartItem, IContactInformations, IProductService, ISession, IWorkshop } from '@/src/types/DBTypes';
import { doc, getDoc, writeBatch } from 'firebase/firestore';

export const getData = async (collection: ENUM_COLLECTIONS, id: string) => {
  const ref = doc(db, collection, id);
  const docSnap = await getDoc(ref);
  if (docSnap.exists()) {
    const prevDocument = docSnap.data() as unknown;
    return { document: prevDocument, ref };
  }
  return { document: null, ref };
};

export const reserveStock = async (
  products: ICartItem[],
  workshops: ICartItem[],
  customer: any
) => {
  const batch = writeBatch(db);
  const previousValues: any = {}; // Object to store previous values

  // Reserve products
  for (const product of products) {
    const { ref, document } = await getData(ENUM_COLLECTIONS.PRODUCTS, product.productId);

    if (!document) return;

    const prevProduct = document as IProductService;

    if (prevProduct.withStock) {
      previousValues[product.productId] = {
        collection: ENUM_COLLECTIONS.PRODUCTS,
        data: {
          stockQuantity: prevProduct.stockQuantity,
        },
      };
      const prevStock = prevProduct.stockQuantity;
      batch.update(ref, {
        stockQuantity: prevStock - product.quantity,
      });
    }
  }

  // Reserve workshops
  for (const workshop of workshops) {
    const { ref, document } = await getData(ENUM_COLLECTIONS.WORKSHOPS, workshop.productId);

    if (!document) return;

    const prevWorkshop = document as IWorkshop;

    previousValues[workshop.productId] = {
      collection: ENUM_COLLECTIONS.WORKSHOPS,
      data: {
        sessions: prevWorkshop.sessions,
      },
    };
    const updatedSessions = (workshop.sessions ?? []).map((session) => {
      const prevSession = prevWorkshop.sessions.find(
        (prev: ISession) => prev._id === session._id
      );
      if (!prevSession) return null;

      return {
        ...prevSession,
        participants: prevSession?.participants
          ? [...prevSession.participants, customer]
          : [customer],
      };
    });
    batch.update(ref, {
      sessions: updatedSessions,
    });
  }

  await batch.commit();
  return previousValues; // Return the stored previous values
};

export const rollbackReservations = async (previousValues: any) => {
  const batch = writeBatch(db);

  for (const id in previousValues) {
    const item = previousValues[id];
    const ref = doc(db, item.collection, id);
    batch.update(ref, item.data);
  }
  await batch.commit();
};

export const isValidContact = (contactInformations: IContactInformations) => {
  if (
    !contactInformations?.firstname ||
    !contactInformations?.email ||
    !contactInformations.lastname ||
    !contactInformations.address
  ) {
    return false;
  }
  return true;
};
