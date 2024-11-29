import { Estimates } from '@/src/app/components/dashboard/financial/estimates/Estimates';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function EstimatePage() {
  const estimates: any = await findAll(ENUM_COLLECTIONS.ESTIMATES);
  return <Estimates initialEstimates={estimates} shouldSubscribe />;
}
