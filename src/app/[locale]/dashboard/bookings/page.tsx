import { Bookings } from '@/src/app/components/dashboard/bookings/Booking';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function BookingsPage() {
  const bookings: any = await findAll(ENUM_COLLECTIONS.BOOKINGS);
  return <Bookings bookings={bookings} />;
}
