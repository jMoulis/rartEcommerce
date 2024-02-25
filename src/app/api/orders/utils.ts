import { ApiPayload } from '@/src/app/contexts/shared/types';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onAdminCreateDocument } from '@/src/lib/firebase/firestore/crud';
import { ICart, ILineItem, IOrderInput } from '@/src/types/DBTypes';

export const createOrder = async (cart: ICart, connectedCustomerId?: string): Promise<ApiPayload | null> => {
  try {
    //  temp password to access invoices
    const date = new Date().toISOString();
    const lineItems: ILineItem[] = cart.items.reduce((acc: ILineItem[], item) => {
      if (item.sessions) {
        item.sessions.forEach((session) => {
          acc.push({
            itemId: session._id,
            description: item.description,
            quantity: 1,
            unitPrice: item.price,
            total: item.price,
          });
        });
      }
      return ([...acc, {
        itemId: item.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price
      }]);
    }, []);

    const orderInput: IOrderInput = {
      customerId: connectedCustomerId ?? null,
      orderDate: date,
      amount: cart.totalPriceAndDelivery || cart.totalPrice,
      status: 'pending',
      createdAt: date,
      updatedAt: date,
      lineItems,
      customerInformations: cart.contactInformations
    };
    const invoice = await onAdminCreateDocument(orderInput, ENUM_COLLECTIONS.ORDERS);
    if (invoice.error) {
      throw Error(invoice.error);
    }
    return invoice;
  } catch (error: any) {
    throw Error(`Error while creating Invoice: ${error.message}`);
  }
};
