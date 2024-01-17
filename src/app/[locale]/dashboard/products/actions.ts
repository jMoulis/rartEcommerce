'use server';

import { ENUM_COLLECTIONS } from '@/src/lib/firebase/enums';
import { onCreateDocument, onUpdateDocument } from '@/src/lib/firebase/firestore/crud';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function upsertProduct(id?: string, formData?: FormData) {
  if (!formData) return;
  const rawFormData: Record<string, FormDataEntryValue> = {};

  formData.forEach((value, key) => {
    if (key.includes('$')) return;
    if (key.includes('images')) return;
    rawFormData[key] = value;
  });
  if (id) {
    await onUpdateDocument(rawFormData, ENUM_COLLECTIONS.PRODUCTS, id);
    const url = `/dashboard/products/${id}`;
    revalidatePath(url);
    revalidatePath('/dashboard/products');
    redirect(url);
  } else {
    const payload = await onCreateDocument(rawFormData, ENUM_COLLECTIONS.PRODUCTS);
    revalidatePath('/dashboard/products');
    redirect(`/dashboard/products/${payload.data?.id}`);
  }
}
