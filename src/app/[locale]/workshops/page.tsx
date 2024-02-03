import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import Workshops from '../../components/client/workshops';
import { findByQuery } from '@/src/lib/firebase/firestore/crud';

export default async function WorkshopsPage() {
  const initialWorkshops: any = await findByQuery(ENUM_COLLECTIONS.WORKSHOPS, {
    published: true,
  });
  return <Workshops initialWorkshops={initialWorkshops} />;
}
