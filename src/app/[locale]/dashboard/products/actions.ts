'use server';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onCreateDocument } from '@/src/lib/firebase/firestore/crud';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertProduct(formData: FormData) {
  const rawFormData: Record<string, FormDataEntryValue> = {};

  formData.forEach((value, key) => {
    if (key.includes('$')) return;
    rawFormData[key] = value;
  });
  const payload = await onCreateDocument(rawFormData, ENUM_COLLECTIONS.PRODUCTS);
  revalidatePath('/dashboard/products');
  redirect(`/dashboard/products/${payload.data?.id}`);
}
