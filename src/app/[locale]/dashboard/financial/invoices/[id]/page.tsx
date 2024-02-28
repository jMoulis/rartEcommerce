import { InvoiceDetail } from '@/src/app/components/dashboard/financial/invoices/InvoiceDetail';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function InvoiceDetailPage({ params }: any) {
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.INVOICES);

  if (payload.error) notFound();
  return <InvoiceDetail invoice={payload.data} />;
}
