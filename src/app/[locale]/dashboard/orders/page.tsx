import { Orders } from '@/src/app/components/dashboard/orders/Orders';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function OrderPage() {
  const orders: any = await findAll(ENUM_COLLECTIONS.ORDERS);
  return <Orders initialOrders={orders} shouldSubscribe />;
}
