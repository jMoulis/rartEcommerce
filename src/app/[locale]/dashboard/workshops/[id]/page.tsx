import { WorkshopForm } from '@/src/app/components/dashboard/workshops/WorkshopForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { IWorkshop } from '@/src/types/DBTypes';
import { notFound } from 'next/navigation';

export default async function WorkshopDetailPage(props: any) {
  const params = await props.params;
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.WORKSHOPS);
  if (payload.error) notFound();
  return <WorkshopForm prevWorkshop={payload.data as IWorkshop} />;
}
