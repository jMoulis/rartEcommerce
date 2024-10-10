import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import Workshops from '../../components/client/workshops';
import { findByQuery } from '@/src/lib/firebase/firestore/crud';
import { ICategory } from '@/src/types/DBTypes';

export default async function WorkshopsPage() {
  const initialWorkshops: any = await findByQuery(ENUM_COLLECTIONS.WORKSHOPS, {
    published: true,
  });
  const initialCategories: ICategory[] = (await findByQuery(
    ENUM_COLLECTIONS.CATEGORIES,
    {}
  )) as ICategory[];
  return (
    <Workshops
      initialWorkshops={initialWorkshops}
      initialCategories={initialCategories}
    />
  );
}
