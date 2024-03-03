import { Customers } from '@/src/app/components/dashboard/customers/Customers';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function CustomersPage() {
  const customers: any = await findAll(ENUM_COLLECTIONS.CUSTOMERS);
  return <Customers initialCustomers={customers} />;
}
