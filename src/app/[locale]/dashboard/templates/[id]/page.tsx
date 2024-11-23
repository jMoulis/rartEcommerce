import { TemplateForm } from '@/src/app/components/dashboard/templates/TemplateForm';
import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { getDocument } from '@/src/lib/firebase/firestore/crud';
import { notFound } from 'next/navigation';

export default async function TemplateDetail(props: any) {
  const params = await props.params;
  const payload = await getDocument(params.id, ENUM_COLLECTIONS.TEMPLATES);

  if (payload.error) notFound();
  return <TemplateForm prevTemplate={payload.data} />;
}
