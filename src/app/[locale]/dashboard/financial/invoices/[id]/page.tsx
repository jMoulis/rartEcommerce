import { InvoiceForm } from '@/src/app/components/dashboard/financial/invoices/InvoiceForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function InvoiceDetailPage(props: any) {
  const params = await props.params;
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.INVOICES);

  if (payload.error) notFound();
  return <InvoiceForm initialInvoice={payload.data} />;
}
