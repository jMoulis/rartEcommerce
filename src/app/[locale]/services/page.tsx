import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import Services from '../../components/client/services';
import { findByQuery } from '@/src/lib/firebase/firestore/crud';

export default async function ServicesPage() {
  const initialBookings: any = await findByQuery(ENUM_COLLECTIONS.BOOKINGS, {
    published: true,
  });
  return <Services initialBookings={initialBookings} />;
}
