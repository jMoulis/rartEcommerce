import { Artworks } from '@/src/app/components/dashboard/artworks/Artworks';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function ArtworksPage() {
  const artworks: any = await findAll(ENUM_COLLECTIONS.ARTWORKS);
  return <Artworks initialArtworks={artworks} shouldSubscribe />;
}
