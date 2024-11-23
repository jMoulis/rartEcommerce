import CustomerDetail from '@/src/app/components/dashboard/customers/CustomerDetail';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function CustomerDetailPage(props: any) {
  const params = await props.params;
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.CUSTOMERS);

  if (payload.error) notFound();
  return <CustomerDetail initialCustomer={payload.data} />;
}
