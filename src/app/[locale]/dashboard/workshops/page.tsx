import Workshops from '@/src/app/components/dashboard/workshops/Workshop';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function WorkshopsPage() {
  const workshops: any = await findAll(ENUM_COLLECTIONS.WORKSHOPS);
  return <Workshops initialWorkshops={workshops ?? []} />;
}
