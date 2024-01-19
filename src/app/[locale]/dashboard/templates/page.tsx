import { Templates } from '@/src/app/components/dashboard/templates/Templates';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { findAll } from '@/src/lib/firebase/firestore/crud';

export default async function TemplatesPage() {
  const templates: any = await findAll(ENUM_COLLECTIONS.TEMPLATES);
  return <Templates templates={templates} />;
}
