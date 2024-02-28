import { Invoices } from '@/src/app/components/dashboard/financial/invoices/Invoices';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function BillingPage() {
  const invoices: any = await findAll(ENUM_COLLECTIONS.INVOICES);
  return <Invoices invoices={invoices} />;
}
