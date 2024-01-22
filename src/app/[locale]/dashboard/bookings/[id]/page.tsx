import { BookingForm } from '@/src/app/components/dashboard/bookings/BookingForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { IBooking } from '@/src/types/DBTypes';
import { notFound } from 'next/navigation';

export default async function BookingsDetailPage({ params }: any) {
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.BOOKINGS);

  if (payload.error) notFound();
  return <BookingForm prevBooking={payload.data as IBooking} />;
}
