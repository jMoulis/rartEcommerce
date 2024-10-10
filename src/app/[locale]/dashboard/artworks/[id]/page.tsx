import { ArtworkForm } from '@/src/app/components/dashboard/artworks/ArtworkForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { IArtwork } from '@/src/types/DBTypes';
import { notFound } from 'next/navigation';

export default async function ArtworkDetailPage({ params }: any) {
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.ARTWORKS);
  if (payload.error) notFound();
  return <ArtworkForm prevArtwork={payload.data as IArtwork} />;
}
