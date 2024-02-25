import WorkshopDetail from '@/src/app/components/client/workshops/WorkshopDetail/WorkshopDetail';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function WorkshopDetailPage({ params }: any) {
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.WORKSHOPS);
  if (payload.error) notFound();
  return <WorkshopDetail initialWorkshop={payload.data} />;
}
